from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from rest_framework import serializers
from .models import Post, Category, Tag, Comment, Like, Bookmark, PasswordResetToken, Notification
from .utils import send_otp_email
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import EmailOTP

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_active=False,
        )

        send_otp_email(user)

        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["email"] = user.email
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token

    def validate(self, attrs):

        username = attrs.get("username")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "detail": "Invalid username or password."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                "detail": "Please verify your email first."
            })

        data = super().validate(attrs)

        data["username"] = self.user.username
        data["email"] = self.user.email
        data["first_name"] = self.user.first_name
        data["last_name"] = self.user.last_name

        return data


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    avatar_upload = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "avatar",
            "avatar_upload",
        ]
        read_only_fields = ["id"]

    def get_avatar(self, obj):
        if hasattr(obj, "profile") and obj.profile.avatar:
            return obj.profile.avatar.url
        return None

    def update(self, instance, validated_data):
        avatar_file = validated_data.pop("avatar_upload", None)

        instance = super().update(instance, validated_data)

        if avatar_file:
            instance.profile.avatar = avatar_file
            instance.profile.save()

        return instance




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'post']

    def get_replies(self, obj):
        replies = obj.replies.all().order_by('created_at')

        return CommentSerializer(
            replies, many=True, context=self.context
        ).data



class RelatedPostMiniSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", default="General")
    author = serializers.CharField(source="author.username")

    class Meta:
        model = Post
        fields = [
            "slug",
            "title",
            "featured_image",
            "category",
            "author",
            "reading_time",
            "created_at",
        ]


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    related_posts = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "featured_image",
            "author",
            "category",
            "tags",
            "comments",
            "status",
            "views",
            "reading_time",
            "is_featured",
            "created_at",
            "updated_at",
            "published_at",
            "likes_count",
            "is_liked",
            "bookmarks_count",
            "is_bookmarked",
            "related_posts",
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                post=obj
            ).exists()

        return False

    def get_bookmarks_count(self, obj):
        return obj.bookmarked_by.count()

    def get_is_bookmarked(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return Bookmark.objects.filter(
                user=request.user,
                post=obj
            ).exists()

        return False

    def get_related_posts(self, obj):
        request = self.context.get("request")

        tag_ids = obj.tags.values_list("id", flat=True)

        related = (
            Post.objects.filter(
                status="published",
                category=obj.category,
            )
            .exclude(id=obj.id)
            .annotate(
                common_tags=Count(
                    "tags",
                    filter=Q(tags__in=tag_ids),
                )
            )
            .order_by("-common_tags", "-created_at")[:4]
        )

        return RelatedPostMiniSerializer(
            related, many=True, context={"request": request}
        ).data


class PostListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    likes_count = serializers.IntegerField(read_only=True)
    bookmarks_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "featured_image",
            "author",
            "category",
            "tags",
            "status",
            "views",
            "reading_time",
            "is_featured",
            "created_at",
            "updated_at",
            "published_at",
            "likes_count",
            "bookmarks_count",
        ]


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    featured_image = serializers.ImageField(required=False)

    class Meta:
        model = Post
        exclude = ["author"]
        read_only_fields = ["reading_time"]

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters long."
            )
        return value

    def validate_excerpt(self, value):
        if value and len(value) > 300:
            raise serializers.ValidationError(
                "Excerpt cannot exceed 300 characters."
            )
        return value

    def validate(self, attrs):
        if not attrs.get("content"):
            raise serializers.ValidationError(
                {"content": "Content cannot be empty."}
            )

        status = attrs.get("status")
        published_at = attrs.get("published_at")

        if status == "scheduled":
            if not published_at:
                raise serializers.ValidationError(
                    {"published_at": "Scheduled posts must have a publish date."}
                )

            if published_at <= timezone.now():
                raise serializers.ValidationError(
                    {"published_at": "Scheduled date must be in the future."}
                )

        return attrs

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'
        read_only_fields = ['user', 'post']


class BookmarkSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = '__all__'
        read_only_fields = ['user', 'post']


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(min_length=6, write_only=True)

    def validate_token(self, value):
        try:
            reset_token = PasswordResetToken.objects.get(token=value)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid token.")

        if not reset_token.is_valid():
            raise serializers.ValidationError("Token expired or already used.")

        self.reset_token = reset_token
        return value



class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    post_slug = serializers.CharField(source='post.slug', read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'sender_username',
            'post_slug',
            'post_title',
            'is_read',
            'created_at',
        ]


class FollowUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']