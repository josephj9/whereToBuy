    import { getJson } from "serpapi";
    import { NextResponse } from "next/server";

    export async function POST(request) {
        const { display_name } = await request.json();
        try {
            const json = await getJson({
            api_key: process.env.SERP_API_KEY,
            engine: "google_shopping",
            google_domain: "google.com",
            q: display_name,
            });
            console.log("sucess", display_name)
            return NextResponse.json(json);
        } catch (err) {
            console.log("fail")
            return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
    }