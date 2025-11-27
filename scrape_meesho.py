import sys
import requests
import json

def scrape_meesho_api(url):
    try:
        # Extract product ID from URL
        product_id = url.rstrip("/").split("/p/")[-1]
        api_url = f"https://www.meesho.com/api/v1/product/{product_id}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
        }

        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()

        data = response.json()["data"]

        result = {
            "title": data.get("name"),
            "price": data.get("price"),
            "mrp": data.get("mrp_details", {}).get("mrp"),
            "image": data.get("images", [""])[0],
            "seller": data.get("supplier_name"),
            "in_stock": data.get("in_stock"),
            "url": url
        }

        print(json.dumps(result, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scrape_meesho_api.py <meesho-url>")
        sys.exit(1)

    url = sys.argv[1]
    if "meesho.com" not in url:
        print("❌ URL must be from meesho.com")
        sys.exit(1)

    scrape_meesho_api(url)
