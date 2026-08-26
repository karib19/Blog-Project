import random
import requests

from django.conf import settings
from django.utils import timezone
from .models import EmailOTP, Post, Follow, Notification


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_email(user):
    EmailOTP.objects.filter(
        user=user,
        is_verified=False
    ).delete()

    otp = generate_otp()

    EmailOTP.objects.create(
        user=user,
        otp=otp
    )

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL},
        "to": [{"email": user.email}],
        "subject": "Verify Your Email",
        "htmlContent": f"""
            <p>Hello {user.username},</p>
            <p>Your OTP is: <strong>{otp}</strong></p>
            <p>This OTP will expire in 5 minutes.</p>
        """,
    }

    response = requests.post(url, json=payload, headers=headers, timeout=10)

    if response.status_code not in (200, 201):
        # log it so you can see the real reason in Render logs
        print("Brevo API error:", response.status_code, response.text)
        response.raise_for_status()


def send_password_reset_email(user, token):
    reset_link = f"https://blog-project-mu-one.vercel.app/reset-password/{token}/"

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL},
        "to": [{"email": user.email}],
        "subject": "Reset Your Password",
        "htmlContent": f"""
            <p>Hello {user.username},</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="{reset_link}">{reset_link}</a></p>
            <p>This link will expire in 15 minutes. If you didn't request this, ignore this email.</p>
        """,
    }

    response = requests.post(url, json=payload, headers=headers, timeout=10)

    if response.status_code not in (200, 201):
        print("Brevo API error:", response.status_code, response.text)
        response.raise_for_status()


def auto_publish_scheduled_posts():
    now = timezone.now()

    due_posts = Post.objects.filter(
        status='scheduled',
        published_at__lte=now,
    )

    for post in due_posts:
        post.status = 'published'
        post.save()
        notify_followers_of_new_post(post)


def notify_followers_of_new_post(post):
    followers = Follow.objects.filter(following=post.author).select_related('follower')

    notifications = [
        Notification(
            recipient=f.follower,
            sender=post.author,
            notification_type='new_post',
            post=post,
        )
        for f in followers
    ]

    Notification.objects.bulk_create(notifications)