from django.contrib.auth.models import User
from rest_framework import generics, filters
from .serializers import PostSerializer, CategorySerializer, TagSerializer, RegisterSerializer, CommentSerializer, LikeSerializer, BookmarkSerializer
from .models import Post, Category, Tag, Comment, Like, Bookmark
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend





class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(
        status='published'
    ).order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tags']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'views']


class PostDetailAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(
        status='published'
    )
    serializer_class = PostSerializer
    lookup_field = 'slug'


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


class LikeAPIView(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            slug=self.kwargs['slug']
        )

        serializer.save(
            user=self.request.user,
            post=post
        )


class BookmarkAPIView(generics.CreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            slug=self.kwargs['slug']
        )

        serializer.save(
            user=self.request.user,
            post=post
        )

class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })



class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer



class PostCreateAPIView(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostUpdateAPIView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    lookup_field = 'slug'

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)


class PostDeleteAPIView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    lookup_field = 'slug'