from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Category, Tag, Comment, Like, Bookmark



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','first_name', 'last_name', 'email', 'password']

    extra_kwargs = {
        "password": {"write_only": True}
    }

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]
        read_only_fields = ["id"]


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

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'post']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                post=obj
            ).exists()

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


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    featured_image = serializers.ImageField(required=False)

    class Meta:
        model = Post
        exclude = ["author"]

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