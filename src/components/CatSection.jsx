import { useState } from "react";
import {
  useGetRandomCatByTagQuery,
  useGetRandomCatGifQuery,
  useGetRandomCatQuery,
} from "../features/cat/catApi";

function CatImage({ src, label }) {
  if (!src) return null;
  return (
    <div className="cat-result">
      <p className="eyebrow">{label}</p>
      <img src={src} alt={label} className="cat-img" />
    </div>
  );
}

export default function CatSection() {
  const [fetchRandom, setFetchRandom] = useState(false);
  const [fetchGif, setFetchGif] = useState(false);
  const [tag, setTag] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [randomKey, setRandomKey] = useState(0);
  const [gifKey, setGifKey] = useState(0);

  const { data: randomCatUrl, isFetching: loadingRandom } =
    useGetRandomCatQuery(randomKey, { skip: !fetchRandom });

  const { data: gifUrl, isFetching: loadingGif } = useGetRandomCatGifQuery(
    gifKey,
    { skip: !fetchGif },
  );

  const { data: tagCatUrl, isFetching: loadingTag } = useGetRandomCatByTagQuery(
    activeTag,
    { skip: !activeTag },
  );

  return (
    <div className="card">
      <p className="eyebrow">Cat API</p>
      <h2>Random Cats</h2>

      <div className="cat-controls">
        <button
          className="primary"
          onClick={() => {
            setFetchRandom(true);
            setRandomKey((k) => k + 1);
          }}
          disabled={loadingRandom}
        >
          {loadingRandom ? "Loading…" : "Random Cat"}
        </button>

        <button
          className="primary"
          onClick={() => {
            setFetchGif(true);
            setGifKey((k) => k + 1);
          }}
          disabled={loadingGif}
        >
          {loadingGif ? "Loading…" : "Random Cat GIF"}
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tag.trim()) setActiveTag(tag.trim());
          }}
          className="cat-tag-form"
        >
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag (e.g. cute)"
          />
          <button type="submit" className="primary" disabled={loadingTag}>
            {loadingTag ? "Loading…" : "By Tag"}
          </button>
        </form>
      </div>

      <div className="cat-images">
        <CatImage src={randomCatUrl} label="Random Cat" />
        <CatImage src={gifUrl} label="Cat GIF" />
        {activeTag && <CatImage src={tagCatUrl} label={`Tag: ${activeTag}`} />}
      </div>
    </div>
  );
}
