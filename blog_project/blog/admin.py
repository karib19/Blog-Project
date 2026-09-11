from django.contrib import admin
from .models import Post, Category, Tag, Comment, Like, Bookmark, Report



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

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ["id", "reporter", "post", "comment", "reason", "status", "created_at"]
    list_filter = ["status", "reason", "created_at"]
    search_fields = ["reporter__username", "post__title", "details"]
    list_editable = ["status"]
    readonly_fields = ["reporter", "post", "comment", "reason", "details", "created_at"]
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Bookmark)