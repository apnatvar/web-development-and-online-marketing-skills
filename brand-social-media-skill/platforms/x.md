# X

- Last verified: 2026-07-22
- Official constraints: standard post 280 characters; Premium long post up to 25,000 characters; each URL counts as 23 characters.
- Sources: [how to post](https://help.x.com/en/using-x/how-to-post), [post types](https://help.x.com/en/using-x/types-of-posts), [link counting](https://help.x.com/en/using-x/how-to-post-a-link)
- Default: generate a 280-character version unless extended-post eligibility is confirmed.

## Purpose and audience behavior

Use X for compressed observations, strong but defensible hooks, public technical discussion, build-in-public updates, launches, replies, quote-post responses, and logically progressive threads. Context is limited, so specificity and qualification matter.

## Formats

Support single posts, alternative hooks, threads, launches, build-in-public updates, concise technical observations, quote-post response drafts, and reply drafts.

## Hook and body

- Use one observation, contrast, finding, mechanism, or question per post.
- Make the subject clear without depending on a click.
- Use threads only when ideas depend on each other; give each post a distinct role.
- Number thread posts only when requested.

For a quote post or reply, preserve the source speaker's meaning. Do not manufacture disagreement or claim to have used or read something absent from context.

## CTA, links, and visuals

Prefer one link or action. Account for X's URL weighting, not raw URL length. Use screenshots, diagrams, or clips only when they add evidence or explanation. Provide alt text and captions.

## Failure modes

Reject arbitrary article fragments, unqualified statistics, vague “hot takes,” copied Threads cadence, hashtag stuffing, invented build-in-public metrics, and posts that exceed the account-appropriate limit.

## Validation checklist

- Confirm standard versus extended-post eligibility.
- Run `scripts/count_characters.py` and account for 23-character URLs.
- Test every thread item independently and as a sequence.
- Verify sources, link destination, mentions, and visual accessibility.
- Generate a compact fallback.

## Fictional example

> Research decisions often lose their source trail across docs, chat, and roadmaps. Fictional LumenDesk groups the source, question, and conclusion around the decision itself. Join the fictional beta: https://example.com/lumendesk-beta

