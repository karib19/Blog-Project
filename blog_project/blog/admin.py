from django.contrib import admin
from .models import Post, Category, Tag, Comment, Like, Bookmark



@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'author',
        'created_at',
        'status'
    )
    list_filter = (
        'created_at',
        'status'
    )
    search_fields = (
        'title',
        'content'
    )
    prepopulated_fields = {
        'slug': ('title',)
    }


admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Bookmark)