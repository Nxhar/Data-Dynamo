import google.generativeai as genai
import PIL.Image

img = PIL.Image.open(r'C:\Users\snsis\Desktop\Hackathons\DataDynamo\backend\samplefood.jpg')
# print(img.show())

GOOGLE_API_KEY='AIzaSyA1OSP9Sccj2O0uBZSME2fz7LIzCx7Im8c'
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro-vision')

response = model.generate_content(["Generate the calorie count for the image", img], stream=True)
response.resolve()
print(response.text)
