'''
a simple tg bot
'''

import urllib.parse
import urllib.request
import os
import json
import dotenv

dotenv.load_dotenv()

TOKEN_TELEGRAM = os.getenv("TOKEN_TELEGRAM")
CHAT_ID = os.getenv("CHAT_ID")
MESSAGE = "Hello from my bot!"
TOKEN_OPEN_WEATHER = os.getenv("TOKEN_OPEN_WEATHER")
TOKEN_EXCHANGE_RATE = os.getenv("TOKEN_EXCHANGE_RATE")
TOKEN_DEEPL = os.getenv("TOKEN_DEEPL")
TOKEN_POKEMON = os.getenv("TOKEN_POKEMON")

TG_URL = f"https://api.telegram.org/bot{TOKEN_TELEGRAM}/sendMessage"
TG_PHOTO_URL = f"https://api.telegram.org/bot{TOKEN_TELEGRAM}/sendPhoto"
DEEPL_URL = "https://api-free.deepl.com/v2/translate"
GEOCODING_URL = f"http://api.openweathermap.org/geo/1.0/direct"
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
EXCHANGE_RATE_URL = "https://api.exchangerate.host/convert"
POKEMON_URL = "https://api.pokemontcg.io/v2/cards"

HELP = """
Available commands:
/translate <LANGUAGE> <TEXT> - translate text to specified language
/weather <CITY> - get current weather for specified city
/currency <CURRENCY> - get exchange rate for specified currency to UAH
/pokemon <NAME> - get a Pokemon card image by name
/exit - exit the bot
"""

def translate_deepl(lang: str, text: str) -> None:
    """
    use deepl api to translate text
    usage: /translate <LANGUAGE> <TEXT>
    """
    try:
        LANGUAGE = lang
        TEXT_TO_TRANSLATE = text
        DEEPL_DATA = urllib.parse.urlencode({
            "auth_key": TOKEN_DEEPL,
            "text": TEXT_TO_TRANSLATE,
            "target_lang": LANGUAGE
        })
        deepl_req = urllib.request.Request(f"{DEEPL_URL}?{DEEPL_DATA}")
        with urllib.request.urlopen(deepl_req) as resp:
            deepl_result = json.loads(resp.read().decode())
        translated_text = deepl_result["translations"][0]["text"]
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": translated_text
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()
    except Exception:
        error_message = "command usage: /translate <LANGUAGE> <TEXT> \n\
Example: /translate EN Привіт світе"
        print(error_message)
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": error_message
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()

def get_weather(city: str) -> None:
    """
    use open weather api to get weather
    usage: /weather <CITY>
    """
    try:
        CITY_NAME = city
        GEOCODING_DATA = urllib.parse.urlencode({
            "q": CITY_NAME,
            "limit": 1,
            "appid": TOKEN_OPEN_WEATHER
        })
        geo_req = urllib.request.Request(f"{GEOCODING_URL}?{GEOCODING_DATA}")
        with urllib.request.urlopen(geo_req) as resp:
            geo_result = json.loads(resp.read().decode())
        lat = geo_result[0]["lat"]
        lon = geo_result[0]["lon"]
        WEATHER_DATA = urllib.parse.urlencode({
            "lat": lat,
            "lon": lon,
            "appid": TOKEN_OPEN_WEATHER,
            "units": "metric"
        })
        weather_req = urllib.request.Request(f"{WEATHER_URL}?{WEATHER_DATA}")
        with urllib.request.urlopen(weather_req) as resp:
            weather_result = json.loads(resp.read().decode())
        weather_desc = "weather: " + weather_result["weather"][0]["description"] + "\n"
        weather_temp = "temp: " + str(weather_result["main"]["temp"]) + " in Celsius\n"
        weather_humidity = "humidity: " + str(weather_result["main"]["humidity"]) + "%\n"
        weather_text = weather_desc + weather_temp + weather_humidity
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": weather_text
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()
    except Exception:
        error_message = "command usage: /weather <CITY> \n\
Example: /weather Kyiv"
        print(error_message)
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": error_message
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()

def get_exchange_rate(currency: str) -> None:
    """
    use exchange rate api to get exchange rate
    usage: /currency <CURRENCY>
    """
    try:
        CURRENCY = currency
        EXCHANGE_RATE_DATA = urllib.parse.urlencode({
            "from": CURRENCY,
            "to": "UAH",
            "amount": 1,
            "access_key": TOKEN_EXCHANGE_RATE
        })
        exrate_req = urllib.request.Request(f"{EXCHANGE_RATE_URL}?{EXCHANGE_RATE_DATA}")
        with urllib.request.urlopen(exrate_req) as resp:
            exrate_result = json.loads(resp.read().decode())
        rate = exrate_result["result"]
        rate_text = f"1 {CURRENCY} = {rate} UAH"
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": rate_text
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()
    except Exception:
        error_message = "command usage: /currency <CURRENCY> \n\
Example: /currency USD"
        print(error_message)
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": error_message
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()

def get_pokemon(name: str) -> None:
    """
    use polemontcg api to get pokemon card
    usage: /pokemon <NAME>
    """
    try:
        POKEMON_NAME = name.lower()
        POKEMON_DATA = urllib.parse.urlencode({
            "q": f'name:{POKEMON_NAME}',
            "pageSize": 1
        })
        pokemon_req = urllib.request.Request(f"{POKEMON_URL}?{POKEMON_DATA}")
        with urllib.request.urlopen(pokemon_req) as resp:
            pokemon_result = json.loads(resp.read().decode())
        pokemon_result = pokemon_result["data"][0]["images"]["large"]
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "photo": pokemon_result
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_PHOTO_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()
    except Exception:
        error_message = "command usage: /pokemon <NAME> \n\
Example: /pokemon pikachu"
        print(error_message)
        TG_DATA = urllib.parse.urlencode({
            "chat_id": CHAT_ID,
            "text": error_message
        }).encode("utf-8")
        tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
        with urllib.request.urlopen(tg_req) as response:
            response.read().decode()

if "__main__" == __name__:
    print(HELP)
    while True:
        command = input("Enter command\n").split()
        if command[0] == "/exit":
            break

        elif command[0] == "/translate":
            translate_deepl(command[1], " ".join(command[2:]))

        elif command[0] == "/weather":
            get_weather(command[1])

        elif command[0] == "/currency":
            get_exchange_rate(command[1])
        
        elif command[0] == "/pokemon":
            get_pokemon(command[1])
        
        else:
            print(HELP)
            TG_DATA = urllib.parse.urlencode({
                "chat_id": CHAT_ID,
                "text": HELP
            }).encode("utf-8")
            tg_req = urllib.request.Request(TG_URL, data=TG_DATA)
            with urllib.request.urlopen(tg_req) as response:
                response.read().decode()
