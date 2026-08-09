from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Like, Comment, Notification


@receiver(post_save, sender=Like)
def create_like_notification(sender, instance, created, **kwargs):
    if created and instance.post.author != instance.user:
        Notification.objects.create(
            recipient=instance.post.author,
            sender=instance.user,
            notification_type='like',
            post=instance.post,
        )


@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    if created and instance.post.author != instance.user:
        Notification.objects.create(
            recipient=instance.post.author,
            sender=instance.user,
            notification_type='comment',
            post=instance.post,
            comment=instance,
        )