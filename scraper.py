import asyncio
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

async def scrape_website(url: str) -> str | None:
    """
    Scrape the full text content of a website's body using Playwright.
    Handles pop-ups/cookie banners and robustly manages errors.
    Returns the text content or None on failure.
    """
    browser = None
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()
            try:
                await page.goto(url, timeout=60000)
            except PlaywrightTimeoutError:
                return None
            # Try to handle common pop-ups/cookie banners
            selectors = [
                "button:has-text('Accept')",
                "button:has-text('I Agree')",
                "button:has-text('Got it')",
                "button:has-text('Close')",
                "button:has-text('OK')",
                "button:has-text('Allow all')",
                "[aria-label='accept']",
                "[aria-label='close']",
            ]
            for selector in selectors:
                try:
                    el = await page.query_selector(selector)
                    if el:
                        await el.click(timeout=2000)
                except Exception:
                    continue
            # Extract body text
            try:
                content = await page.text_content('body')
                return content.strip() if content else None
            except Exception:
                return None
            finally:
                await context.close()
                await browser.close()
    except Exception:
        if browser:
            await browser.close()
        return None

if __name__ == '__main__':
    async def main():
        url = 'https://thissitedoesnotexist12345.com'
        result = await scrape_website(url)
        print(result if result else 'Failed to scrape website.')
    asyncio.run(main()) 