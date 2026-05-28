import sys
from youtube_transcript_api import YouTubeTranscriptApi

video_id = sys.argv[1]
try:
    ytt = YouTubeTranscriptApi()
    t = ytt.fetch(video_id)
    print(" ".join([x.text for x in t]))
except Exception as e:
    try:
        ytt = YouTubeTranscriptApi()
        transcripts = ytt.list(video_id)
        t = transcripts.find_transcript(["ar","en"]).fetch()
        print(" ".join([x.text for x in t]))
    except Exception as e2:
        print("ERROR:" + str(e2), file=sys.stderr)
        sys.exit(1)
