"use client";
import { useEffect } from "react";

export function RedirectClient({ url }: { url: string }) {
    useEffect(() => {
        const isBotDetailed = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            
            const botPatterns = [
                // Google bots (various user agents)
                'googlebot',
                'google-structured-data-testing-tool',
                'google web preview',
                'google favicon',
                'adsbot-google',
                'mediapartners-google',
                'google-read-aloud',
                'storebot-google',
                'google-site-verification',
                
                // Other common bots
                'bingbot',
                'yandexbot',
                'duckduckbot',
                'slurp',           // Yahoo
                'baiduspider',
                'facebookexternalhit',
                'twitterbot',
                'rogerbot',
                'linkedinbot',
                'embedly',
                'quora link preview',
                'showyoubot',
                'outbrain',
                'pinterest',
                'slackbot',
                'vkshare',
                'w3c_validator',
                'crawler',
                'spider',
                'ahrefsbot',
                'semrushbot',
                'screaming frog',
                'proximic',
                'ia_archiver',     // Internet Archive
                'exabot',
                'sogou',
                'dotbot',
                'mj12bot',
                'seznambot',
                'applebot'
            ];
            
            return botPatterns.some(bot => userAgent.includes(bot));
        };

        if (!isBotDetailed()) {
            const timer = setTimeout(() => {
                window.location.href = url;
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            console.log("Bot detected, redirection canceled");
        }
    }, [url]);

    return null;
}