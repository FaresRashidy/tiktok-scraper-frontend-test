let videoData = null;

window.download = async function () {
  const url = document.getElementById("url").value.trim();
  const result = document.getElementById("result");
  const preview = document.getElementById("preview");
  const cover = document.getElementById("cover");
  const videoTitle = document.getElementById("videoTitle");

  result.textContent = "Fetching video...";
  preview.classList.add("hidden");

  if (!url) {
    result.textContent = "Please enter a TikTok URL.";
    return;
  }

  try {
    const res = await fetch(
      "https://tiktok-scraper-backend-test-production.up.railway.app/api/video",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );

    const data = await res.json();
    if (!data.success) throw new Error("Could not fetch video");

    videoData = data.data;
    result.textContent = "";
    cover.src = videoData.cover;
    videoTitle.textContent = videoData.title;
    preview.classList.remove("hidden");
  } catch (err) {
    result.textContent = "Error: " + err.message;
    preview.classList.add("hidden");
  }
};

window.downloadSD = () =>
  handleDownload(videoData?.video, videoData?.title + "_SD.mp4");
window.downloadHD = () =>
  handleDownload(videoData?.video_hd, videoData?.title + "_HD.mp4");

function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "").trim();
}

async function handleDownload(url, filename) {
  if (!url || !filename) return alert("Missing download data");
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed.");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = sanitizeFileName(filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    alert("Error: " + err.message);
  }
}
