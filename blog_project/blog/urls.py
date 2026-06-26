from django.urls import path
from .views import PostListAPIView, PostDetailAPIView, CategoryListAPIView, TagListAPIView, ProfileAPIView


urlpatterns = [
    path('api/posts/',PostListAPIView.as_view(),name='api-post-list'),
    path('api/posts/<slug:slug>/',PostDetailAPIView.as_view(),name='api-post-detail'),
    path('api/categories/',CategoryListAPIView.as_view(),name='api-categories'),
    path('api/tags/',TagListAPIView.as_view(),name='api-tags'),
    path('api/profile/',ProfileAPIView.as_view(),name='profile'),
]