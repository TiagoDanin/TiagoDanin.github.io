interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = "YouTube video" }: YouTubeEmbedProps) {
  return (
    <div className="youtube-embed">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?cc_load_policy=1&cc_lang_pref=en&hl=en`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
