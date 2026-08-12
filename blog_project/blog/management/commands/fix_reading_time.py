from django.core.management.base import BaseCommand
from blog.models import Post


class Command(BaseCommand):
    help = "Recalculate reading_time for all existing posts"

    def handle(self, *args, **kwargs):
        posts = Post.objects.all()
        count = 0

        for post in posts:
            post.save()
            count += 1

        self.stdout.write(
            self.style.SUCCESS(f"Updated reading_time for {count} posts.")
        )