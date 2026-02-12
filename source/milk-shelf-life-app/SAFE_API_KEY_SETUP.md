# Secure OpenAI API Key Setup for Dairy Guard

Security is critical. **NEVER** commit your API keys to GitHub or expose them in your frontend code (`.tsx`, `.ts`, `.js` files).

## 1. Get Your API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy it immediately (starts with `sk-...`)

## 2. Set Key for Production (Cloud)
Run this command in your terminal to securely store the key in your Supabase project's vault:

```bash
npx supabase secrets set OPENAI_API_KEY=sk-your-actual-api-key-here
```
*(Replace `sk-your-actual-api-key-here` with your real key)*

To verify it is set:
```bash
npx supabase secrets list
```

## 3. Set Key for Local Development
If you test functions locally using `supabase functions serve`, create a `.env` file in `supabase/functions/` (or use the main `.env`):

1. Create a file named `.env.local` in `source/milk-shelf-life-app/`
2. Add this line:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. When running locally, use:
   ```bash
   npx supabase functions serve --env-file .env.local
   ```
   *Note: Make sure `.env.local` is in your `.gitignore` file!*

## 4. Deploy Your Function
Once your key is set, deploy the function to make it live:

```bash
npx supabase functions deploy dairy-doctor
```

## Success Check
Go to your app, click **"Get Expert Advice"**, and if you see a response, it works!
