import random
import resend
from django.conf import settings

from .models import EmailOTP


resend.api_key = settings.RESEND_API_KEY


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

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": user.email,
        "subject": "Verify Your Email",
        "html": f"""
        <h2>Hello {user.username}</h2>

        <p>Your OTP is:</p>

        <h1>{otp}</h1>

        <p>This OTP will expire in 5 minutes.</p>
        """
    })