import random
from django.core.mail import send_mail
from django.conf import settings

from .models import EmailOTP


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

    send_mail(
        subject="Verify Your Email",
        message=f"""
Hello {user.username},

Your OTP is:

{otp}

This OTP will expire in 5 minutes.
""",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )