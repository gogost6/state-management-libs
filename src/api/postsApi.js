export async function getPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}
