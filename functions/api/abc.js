/**
 * POST /api/abc
 */
 export async function onRequestGet(context) {
    try {
        const ua = context.request.headers.get('user-agent');
        const country = context.request.cf.country;
        const city = context.request.cf.city;
        const ip = context.request.headers.get('CF-Connecting-IP');
        const rayID = context.request.headers.get('CF-RAY');

        var date = new Date(Date.now());
        date.setHours(date.getHours() + 8);
        var timeID = date.toISOString().replace(/T/, '').replace(/Z/, '').replace(/-/g,'').replace(/:/g, '').replace('.', '');

        var keyID = timeID + "_" + rayID;
        await context.env.DEMO_VIEWS.put(keyID, JSON.stringify({
            "city": city,
            "country": country,
            "ip": ip,
            "ua": ua,
            "time": timeID,
            "ray": rayID
        }));

        body = {"ok": true};
        options = { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } };
        return new Response(JSON.stringify(body), options);
    } catch (err) {
        return new Response('Bad Request in abc', { status: 400 });
    }
 }