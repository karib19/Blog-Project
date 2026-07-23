from django.contrib.auth.models import User
from rest_framework import generics, filters, status
from .serializers import PostSerializer, CategorySerializer, TagSerializer, RegisterSerializer, VerifyOTPSerializer, CustomTokenObtainPairSerializer, CommentSerializer, LikeSerializer, BookmarkSerializer, PostCreateUpdateSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Post, Category, Tag, Comment, Like, Bookmark
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser



from .models import EmailOTP
from django.utils import timezone
from .utils import send_otp_email



class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()

        user.is_active = False
        user.save()

        send_otp_email(user)


class VerifyOTPAPIView(APIView):
    def post(self, request):

        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            otp_obj = EmailOTP.objects.get(
                user=user,
                otp=otp,
                is_verified=False
            )
        except EmailOTP.DoesNotExist:
            return Response(
                {"error": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if timezone.now() > otp_obj.expires_at:
            return Response(
                {"error": "OTP has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_obj.is_verified = True
        otp_obj.save()

        user.is_active = True
        user.save()

        return Response(
            {"message": "Email verified successfully."},
            status=status.HTTP_200_OK
        )


class ResendOTPAPIView(APIView):
    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        send_otp_email(user)

        return Response(
            {"message": "OTP sent successfully."},
            status=status.HTTP_200_OK
        )



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(
        status='published'
    ).order_by('-created_at')

    serializer_class = PostSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = ['category', 'tags']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'views']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class PostDetailAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(
        status='published'
    )

    serializer_class = PostSerializer
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class PostCreateAPIView(generics.CreateAPIView):
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostUpdateAPIView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser]

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)


class PostDeleteAPIView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    lookup_field = 'slug'


class MyPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(
            author=self.request.user
        ).order_by('-created_at')


class MyBookmarksAPIView(generics.ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "total_posts": Post.objects.filter(author=user).count(),
            "published_posts": Post.objects.filter(
                author=user,
                status="published"
            ).count(),
            "draft_posts": Post.objects.filter(
                author=user,
                status="draft"
            ).count(),
            "total_comments": Comment.objects.filter(
                user=user
            ).count(),
            "total_bookmarks": Bookmark.objects.filter(
                user=user
            ).count(),
            "total_likes": Like.objects.filter(
                user=user
            ).count(),
        })


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TagListAPIView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(
            post__slug=self.kwargs['slug']
        ).order_by('-created_at')

    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            slug=self.kwargs['slug']
        )
        serializer.save(
            user=self.request.user,
            post=post
        )



class LikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug)

        like = Like.objects.filter(
            user=request.user,
            post=post
        ).first()

        if like:
            like.delete()
            return Response(
                {"message": "Post unliked"},
                status=status.HTTP_200_OK
            )

        Like.objects.create(
            user=request.user,
            post=post
        )

        return Response(
            {"message": "Post liked"},
            status=status.HTTP_201_CREATED
        )


class BookmarkAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug)

        bookmark = Bookmark.objects.filter(
            user=request.user,
            post=post
        ).first()

        if bookmark:
            bookmark.delete()
            return Response(
                {"message": "Bookmark removed"},
                status=status.HTTP_200_OK
            )

        Bookmark.objects.create(
            user=request.user,
            post=post
        )

        return Response(
            {"message": "Post bookmarked"},
            status=status.HTTP_201_CREATED
        )


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(old_password):
            return Response(
                {"old_password": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {"confirm_password": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"new_password": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )
