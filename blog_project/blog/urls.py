from django.urls import path
from .views import PostListAPIView, PostDetailAPIView, CategoryListAPIView, TagListAPIView, CommentListCreateAPIView, LikeAPIView, ProfileAPIView, RegisterAPIView, PostCreateAPIView, PostUpdateAPIView, PostDeleteAPIView, BookmarkAPIView


urlpatterns = [
    path('api/posts/create/',PostCreateAPIView.as_view(),name='post-create'),
    path('api/posts/<slug:slug>/update/',PostUpdateAPIView.as_view(),name='post-update'),
    path('api/posts/<slug:slug>/delete/',PostDeleteAPIView.as_view(),name='post-delete'),
    path('api/posts/',PostListAPIView.as_view(),name='api-post-list'),
    path('api/posts/<slug:slug>/',PostDetailAPIView.as_view(),name='api-post-detail'),
    path('api/categories/',CategoryListAPIView.as_view(),name='api-categories'),
    path('api/tags/',TagListAPIView.as_view(),name='api-tags'),
    path('api/posts/<slug:slug>/comments/',CommentListCreateAPIView.as_view(),name='comments'),
    path('api/posts/<slug:slug>/like/',LikeAPIView.as_view(),name='post-like'),
    path('api/posts/<slug:slug>/bookmark/',BookmarkAPIView.as_view(),name='post-bookmark'),
    path('api/profile/',ProfileAPIView.as_view(),name='profile'),
    path('api/register/',RegisterAPIView.as_view(),name='register'),
]