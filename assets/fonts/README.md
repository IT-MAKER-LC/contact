# Fonts — IBM Plex Sans + IBM Plex Mono (self-hosted)

The site loads these locally so there are **no external font calls** (privacy + speed).
Until the files are here, the browser falls back to a clean system stack — the site
still looks correct, just not in Plex.

You need these five files in this folder (names must match exactly — the `@font-face`
rules in `css/styles.css` point to them):

```
IBMPlexSans-Regular.woff2    (400)
IBMPlexSans-Medium.woff2     (500)
IBMPlexSans-SemiBold.woff2   (600)
IBMPlexMono-Regular.woff2    (400)
IBMPlexMono-Medium.woff2     (500)
```

---

## Easiest: one PowerShell script (downloads + names them for you)

Run this from the **site root** (the folder containing `index.html`). It pulls the
official woff2 files from the Fontsource CDN and drops them in with the right names.

```powershell
$dst = "assets/fonts"
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$sans = "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans@5/files"
$mono = "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@5/files"

$map = @{
  "$sans/ibm-plex-sans-latin-400-normal.woff2" = "IBMPlexSans-Regular.woff2"
  "$sans/ibm-plex-sans-latin-500-normal.woff2" = "IBMPlexSans-Medium.woff2"
  "$sans/ibm-plex-sans-latin-600-normal.woff2" = "IBMPlexSans-SemiBold.woff2"
  "$mono/ibm-plex-mono-latin-400-normal.woff2" = "IBMPlexMono-Regular.woff2"
  "$mono/ibm-plex-mono-latin-500-normal.woff2" = "IBMPlexMono-Medium.woff2"
}

foreach ($u in $map.Keys) {
  Invoke-WebRequest -Uri $u -OutFile (Join-Path $dst $map[$u])
  Write-Host "Saved $($map[$u])"
}
```

Bash/macOS/Linux equivalent:

```bash
dst="assets/fonts"; mkdir -p "$dst"
sans="https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans@5/files"
mono="https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@5/files"
curl -Lo "$dst/IBMPlexSans-Regular.woff2"  "$sans/ibm-plex-sans-latin-400-normal.woff2"
curl -Lo "$dst/IBMPlexSans-Medium.woff2"   "$sans/ibm-plex-sans-latin-500-normal.woff2"
curl -Lo "$dst/IBMPlexSans-SemiBold.woff2" "$sans/ibm-plex-sans-latin-600-normal.woff2"
curl -Lo "$dst/IBMPlexMono-Regular.woff2"  "$mono/ibm-plex-mono-latin-400-normal.woff2"
curl -Lo "$dst/IBMPlexMono-Medium.woff2"   "$mono/ibm-plex-mono-latin-500-normal.woff2"
```

## Manual alternative

Download each woff2 by pasting these URLs in a browser, then rename per the list above:

- Sans 400: `https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans@5/files/ibm-plex-sans-latin-400-normal.woff2`
- Sans 500: `.../ibm-plex-sans-latin-500-normal.woff2`
- Sans 600: `.../ibm-plex-sans-latin-600-normal.woff2`
- Mono 400: `https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-mono@5/files/ibm-plex-mono-latin-400-normal.woff2`
- Mono 500: `.../ibm-plex-mono-latin-500-normal.woff2`

Source project: IBM Plex — SIL Open Font License (free for commercial use). Fontsource just
repackages the official fonts as ready-to-use woff2.

## Verify

After adding the files, hard-refresh the site (Ctrl+F5) and check DevTools → Network →
filter "font" — you should see the woff2 files load from your own domain, not Google.
