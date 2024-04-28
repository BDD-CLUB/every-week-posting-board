const REPO_OWNER = 'BDD-CLUB';
const REPO_NAME = 'challenge-every-week-posting';

export async function fetchDiscussions(categoryId = null, answered = null) {
    const url = `https://api.github.com/graphql`;
    const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        discussions(first: 100, categoryId: ${categoryId}, answered: ${answered}, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            id
            title
            body
            url
            createdAt
            author {
              login
              avatarUrl
            }
            category {
              name
            }
          }
        }
      }
    }
  `;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.data.repository.discussions.nodes
        .filter(discussion => discussion.category.name !== "주간 통계" && discussion.category.name !== "6. 반성문");
}
