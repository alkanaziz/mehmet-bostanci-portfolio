import { getProcessedPhotos } from "@/lib/photoUtils";
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic');
  
  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  try {
    const photos = await getProcessedPhotos(topic);
    console.log({topic, photos});
    if (!photos) {
      return NextResponse.json({ error: "Photos not found" }, { status: 404 });
    }
    return NextResponse.json(photos, { status: 200 });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
