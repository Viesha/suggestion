from django.db import models

# Create your models here.

class TestData(models.Model):
    val = models.DecimalField(max_digits=10, decimal_places=4)
    ts = models.DateTimeField(blank=True, null=True)

    dp = models.IntegerField()


    class Meta:
        managed = True
        db_table = 'test_data'
        verbose_name_plural = "Datas"