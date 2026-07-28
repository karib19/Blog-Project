import random
import traceback

from django.conf import settings
from django.core.mail import send_mail

from .models import EmailOTP


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_email(user):
    try:
        print("STEP 1")

        EmailOTP.objects.filter(
            user=user,
            is_verified=False
        ).delete()

        print("STEP 2")

        otp = generate_otp()

        print("STEP 3")

        EmailOTP.objects.create(
            user=user,
            otp=otp
        )

        print("STEP 4")

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

        print("STEP 5")

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        traceback.print_exc()
        raise