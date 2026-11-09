import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";

export default function SocialMediaSection({ channels, collectionHref = "" }) {
  const channelIds = Object.keys(channels);
  const tabsId = React.useId();
  const tabRefs = React.useRef([]);
  const [activeChannel, setActiveChannel] = React.useState(channelIds[0]);
  const channel = channels[activeChannel];

  if (!channel) return null;

  return <section className="social-media-section insights-shell" aria-labelledby="social-media-title">
    <header className="editorial-section-head editorial-section-head--row">
      <div><span>Social &amp; Media</span><h2 id="social-media-title">From Our Channels</h2><p>Selected publications from INVESG's official social channels.</p></div>
      <div className="social-header-links">
        {collectionHref && <Link to={collectionHref}>View media collection</Link>}
        <a href={channel.channelUrl} target="_blank" rel="noreferrer">Visit {channel.label} <ArrowUpRight /></a>
      </div>
    </header>
    <div className="insight-tabs" role="tablist" aria-label="Social channel">{channelIds.map((id, index) => <button type="button" role="tab" key={id} id={`${tabsId}-${id}`} aria-controls={`${tabsId}-panel`} ref={element => { tabRefs.current[index] = element; }} tabIndex={activeChannel === id ? 0 : -1} aria-selected={activeChannel === id} onClick={() => setActiveChannel(id)} onKeyDown={event => { const next = event.key === "ArrowRight" ? (index + 1) % channelIds.length : event.key === "ArrowLeft" ? (index + channelIds.length - 1) % channelIds.length : event.key === "Home" ? 0 : event.key === "End" ? channelIds.length - 1 : null; if (next !== null) { event.preventDefault(); setActiveChannel(channelIds[next]); tabRefs.current[next]?.focus(); } }}><span className={`channel-mark channel-mark--${id}`}>{id === "linkedin" ? "in" : "◎"}</span>{channels[id].label}</button>)}</div>
    <div className="social-card-grid" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-${activeChannel}`} tabIndex={0}>
      {channel.posts.map((post) => <a className="social-publication-card" href={post.sourceUrl} target="_blank" rel="noreferrer" key={post.id}>
        <div className="social-publication-image" style={{ backgroundImage: `url('${post.image}')`, backgroundPosition: post.imagePosition }}>{post.type === "video" && <span><Play /></span>}</div>
        <div><span>{channel.label} · {post.topic}</span><h3>{post.title}</h3><p>{post.summary}</p><b>View on {channel.label} <ArrowUpRight /></b></div>
      </a>)}
    </div>
  </section>;
}
