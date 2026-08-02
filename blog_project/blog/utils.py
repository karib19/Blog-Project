import random
import requests

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