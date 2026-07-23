from django.urls import path
from .views import PostListAPIView, PostDetailAPIView, CategoryListAPIView, TagListAPIView, CommentListCreateAPIView, LikeAPIView, ProfileAPIView, RegisterAPIView, VerifyOTPAPIView, ResendOTPAPIView, CustomTokenObtainPairView, PostCreateAPIView, PostUpdateAPIView, PostDeleteAPIView, BookmarkAPIView, MyPostsAPIView, MyBookmarksAPIView,DashboardAPIView, ChangePasswordAPIView


urlpatterns = [
    path('api/register/',RegisterAPIView.as_view(),name='register'),
    path("api/verify-otp/",VerifyOTPAPIView.as_view(),name="verify-otp",),
    path("api/resend-otp/",ResendOTPAPIView.as_view(),name="resend-otp",),
    path("api/token/",CustomTokenObtainPairView.as_view(),name="token_obtain_pair",),
    path('api/profile/',ProfileAPIView.as_view(),name='profile'),
    path('api/posts/',PostListAPIView.as_view(),name='api-post-list'),
    path('api/posts/create/',PostCreateAPIView.as_view(),name='post-create'),
    path('api/posts/<slug:slug>/',PostDetailAPIView.as_view(),name='api-post-detail'),
    path('api/posts/<slug:slug>/update/',PostUpdateAPIView.as_view(),name='post-update'),
    path('api/posts/<slug:slug>/delete/',PostDeleteAPIView.as_view(),name='post-delete'),
    path('api/my-posts/',MyPostsAPIView.as_view(),name='my-posts'),
    path('api/my-bookmarks/',MyBookmarksAPIView.as_view(),name='my-bookmarks'),
    path('api/dashboard/',DashboardAPIView.as_view(),name='dashboard'),
    path('api/categories/',CategoryListAPIView.as_view(),name='api-categories'),
    path('api/tags/',TagListAPIView.as_view(),name='api-tags'),
    path('api/posts/<slug:slug>/comments/',CommentListCreateAPIView.as_view(),name='comments'),
    path('api/posts/<slug:slug>/like/',LikeAPIView.as_view(),name='post-like'),
    path('api/posts/<slug:slug>/bookmark/',BookmarkAPIView.as_view(),name='post-bookmark'),
    path("api/change-password/",ChangePasswordAPIView.as_view(),name="change-password",),


]