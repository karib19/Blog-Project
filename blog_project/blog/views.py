from rest_framework import generics
from .serializers import PostSerializer, CategorySerializer, TagSerializer
from .models import Post, Category, Tag
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated



class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(
        status='published'
    ).order_by('-created_at')
    serializer_class = PostSerializer


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


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })
