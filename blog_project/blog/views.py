from django.contrib.auth.models import User
from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework import generics, filters, status
from .serializers import PostSerializer, PostListSerializer, CategorySerializer, TagSerializer, RegisterSerializer, VerifyOTPSerializer, CustomTokenObtainPairSerializer, CommentSerializer, LikeSerializer, BookmarkSerializer, PostCreateUpdateSerializer, UserSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer, NotificationSerializer, FollowUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Post, Category, Tag, Comment, Like, Bookmark, PasswordResetToken, Notification, EmailOTP
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.exceptions import PermissionDenied
from .permissions import IsAuthorOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from datetime import timedelta
from .utils import send_otp_email, send_password_reset_email, auto_publish_scheduled_posts, notify_followers_of_new_post
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings



class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


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
                is_verified=False,
            )

        except EmailOTP.DoesNotExist:
            return Response(
                {"error": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if timezone.now() > otp_obj.expires_at:

            return Response(
                {"error": "OTP expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        otp_obj.is_verified = True
        otp_obj.save()

        user.is_active = True
        user.save()

        return Response(
            {
                "message": "Email verified successfully."
            },
            status=status.HTTP_200_OK
        )


def test_email(request):
        send_mail(
        subject="Test",
        message="Hello from Render",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=["karibgaming47@gmail.com"],
        fail_silently=False,
        )

        return JsonResponse({"success": True})


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

        if user.is_active:
            return Response(
                {
                    "message": "Email is already verified."
                },
                status=status.HTTP_200_OK
            )

        send_otp_email(user)

        return Response(
            {
                "message": "OTP sent successfully."
            },
            status=status.HTTP_200_OK
        )



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user


class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(
        status="published"
    ).order_by("-created_at")

    serializer_class = PostListSerializer
    permission_classes = [AllowAny]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["category", "tags"]
    search_fields = ["title", "content"]
    ordering_fields = [
        "created_at",
        "updated_at",
        "views",
    ]

    def get_queryset(self):

        auto_publish_scheduled_posts()

        return (
            Post.objects
            .filter(status="published")
            .select_related("author", "category")
            .prefetch_related("tags")
            .annotate(
                likes_count=Count("likes", distinct=True),
                bookmarks_count=Count("bookmarked_by", distinct=True),
            )
            .order_by("-created_at")
        )


class PostDetailAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(
        status='published'
    )

    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        auto_publish_scheduled_posts()
        return super().get_queryset()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class PostCreateAPIView(generics.CreateAPIView):
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)

        if post.status == 'published':
            notify_followers_of_new_post(post)


class PostUpdateAPIView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser]

    def perform_update(self, serializer):
        serializer.save()


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
    permission_classes = [AllowAny]


class TagListAPIView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]


class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(
            post__slug=self.kwargs['slug'],
            parent__isnull=True,
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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class CommentDeleteAPIView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        comment = get_object_or_404(Comment, pk=self.kwargs['pk'])

        if comment.user != self.request.user:
            raise PermissionDenied("You can only delete your own comments.")

        return comment


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


class PasswordResetRequestAPIView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=serializer.validated_data["email"])


        PasswordResetToken.objects.filter(user=user, is_used=False).delete()

        reset_token = PasswordResetToken.objects.create(user=user)

        send_password_reset_email(user, reset_token.token)

        return Response(
            {"message": "Password reset link sent to your email."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmAPIView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_token = serializer.reset_token
        user = reset_token.user

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        reset_token.is_used = True
        reset_token.save()

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK,
        )


class NotificationListAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class MarkNotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(
            Notification, pk=pk, recipient=request.user
        )
        notification.is_read = True
        notification.save()
        return Response({"message": "Marked as read"})


class MarkAllNotificationsReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(
            recipient=request.user, is_read=False
        ).update(is_read=True)
        return Response({"message": "All marked as read"})


class UnreadNotificationCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            recipient=request.user, is_read=False
        ).count()
        return Response({"unread_count": count})



class TrendingPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        days = int(self.request.query_params.get("days", 7))
        since = timezone.now() - timedelta(days=days)

        return (
            Post.objects.filter(status="published", created_at__gte=since)
            .order_by("-views")[:6]
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class PopularPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        exclude_slug = self.request.query_params.get("exclude")

        queryset = Post.objects.filter(status="published").order_by("-views")

        if exclude_slug:
            queryset = queryset.exclude(slug=exclude_slug)

        return queryset[:5]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class AuthorProfileAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        username = self.kwargs['username']

        return Post.objects.filter(
            author__username=username,
            status='published',
        ).order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        author = get_object_or_404(User, username=username)

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page or queryset, many=True)

        is_following = False
        if request.user.is_authenticated:
            is_following = Follow.objects.filter(
                follower=request.user,
                following=author
            ).exists()

        author_data = {
            "username": author.username,
            "first_name": author.first_name,
            "last_name": author.last_name,
            "avatar": (
                author.profile.avatar.url
                if hasattr(author, "profile") and author.profile.avatar
                else None
            ),
            "total_posts": queryset.count(),
            "followers_count": Follow.objects.filter(following=author).count(),
            "following_count": Follow.objects.filter(follower=author).count(),
            "is_following": is_following,
            "joined": author.date_joined,
        }

        if page is not None:
            paginated_response = self.get_paginated_response(serializer.data)
            paginated_response.data["author"] = author_data
            return paginated_response

        return Response({
            "author": author_data,
            "results": serializer.data,
        })


class ArchiveSummaryAPIView(APIView):
    def get(self, request):
        summary = (
            Post.objects.filter(status="published")
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("-month")
        )

        data = [
            {
                "year": item["month"].year,
                "month": item["month"].month,
                "label": item["month"].strftime("%B %Y"),
                "count": item["count"],
            }
            for item in summary
        ]

        return Response(data)


class ArchiveByMonthAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        year = self.kwargs["year"]
        month = self.kwargs["month"]

        return Post.objects.filter(
            status="published",
            created_at__year=year,
            created_at__month=month,
        ).order_by("-created_at")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context



class FollowToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)

        if target_user == request.user:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        follow = Follow.objects.filter(
            follower=request.user,
            following=target_user
        ).first()

        if follow:
            follow.delete()
            return Response(
                {"message": "Unfollowed", "is_following": False},
                status=status.HTTP_200_OK
            )

        Follow.objects.create(
            follower=request.user,
            following=target_user
        )

        Notification.objects.create(
            recipient=target_user,
            sender=request.user,
            notification_type='follow',
        )

        return Response(
            {"message": "Followed", "is_following": True},
            status=status.HTTP_201_CREATED
        )


class FollowersListAPIView(generics.ListAPIView):
    serializer_class = FollowUserSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return User.objects.filter(following__following=user)


class FollowingListAPIView(generics.ListAPIView):
    serializer_class = FollowUserSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return User.objects.filter(followers__follower=user)