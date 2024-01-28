from typing import Any
from django.db.models import F
from django.shortcuts import render, get_object_or_404


from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.views import generic
from django.utils import timezone
from django.template import loader

from .models import User, Game, Tournament

def index(request):
    template = loader.get_template("index.html")
    output = {
        "res": "CACA"
    }
    return (HttpResponse(template.render(output, request)))