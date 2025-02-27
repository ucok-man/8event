// /\/upload\/  => Matches /upload/ literally
// v\d+         => Matches v followed by one or more digits (\d+) → (e.g., v1738269093)
// \/           => Matches / (slash)
// (.+)         => Captures everything after the version number
// $            => End of the string
// \.[^.]+$     => Matches the last dot (.) and everything after it, ensuring all file extensions are removed
// -> capture everything after the version number and remove the last dot to the end

export const cloudinaryPublicIdFromURL = (url: string): string | null => {
  const match = url.match(/\/upload\/v\d+\/(.+)\.[^.]+$/);
  return match ? match[1] : null;
};
