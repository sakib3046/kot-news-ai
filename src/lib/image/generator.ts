import sharp from "sharp";
import { writeFileSync } from "fs";
import { join } from "path";
import fetch from "node-fetch";

export interface ImageGenerationParams {
  title: string;
  subtitle: string;
  imageUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export async function generateNewsImage(
  params: ImageGenerationParams
): Promise<Buffer> {
  const {
    title,
    subtitle,
    imageUrl,
    logoUrl,
    primaryColor = "#1a1a1a",
    secondaryColor = "#ffffff",
    accentColor = "#0066cc",
  } = params;

  const width = 1200;
  const height = 630;

  try {
    // Start with background
    let imageBuffer = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: primaryColor,
      },
    }).png().toBuffer();

    // If image URL is provided, try to fetch and overlay it
    if (imageUrl) {
      try {
        imageBuffer = await addImageOverlay(imageBuffer, imageUrl, width, height);
      } catch (error) {
        console.warn("Could not add image overlay, using solid background");
      }
    }

    // Create SVG with text overlay
    const svg = createTextOverlay(
      title,
      subtitle,
      logoUrl,
      width,
      height,
      secondaryColor,
      accentColor
    );

    // Composite SVG on top
    imageBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(svg),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    return imageBuffer;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a basic image if generation fails
    return await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: primaryColor,
      },
    }).png().toBuffer();
  }
}

function createTextOverlay(
  title: string,
  subtitle: string,
  logoUrl: string | undefined,
  width: number,
  height: number,
  textColor: string,
  accentColor: string
): string {
  // Ensure title and subtitle fit
  const maxTitleChars = 80;
  const maxSubtitleChars = 150;

  const displayTitle =
    title.length > maxTitleChars
      ? title.substring(0, maxTitleChars) + "..."
      : title;

  const displaySubtitle =
    subtitle.length > maxSubtitleChars
      ? subtitle.substring(0, maxSubtitleChars) + "..."
      : subtitle;

  // Create SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Semi-transparent overlay -->
      <rect width="${width}" height="${height}" fill="rgba(26, 26, 26, 0.6)"/>
      
      <!-- Accent bar -->
      <rect width="${width}" height="8" fill="${accentColor}"/>
      
      <!-- Logo placeholder (top right) -->
      <g transform="translate(${width - 100}, 20)">
        <circle cx="40" cy="40" r="35" fill="${accentColor}" opacity="0.1"/>
        <text x="40" y="48" font-size="24" font-weight="bold" fill="${accentColor}" text-anchor="middle" font-family="Arial, sans-serif">
          AI
        </text>
      </g>
      
      <!-- Title -->
      <g transform="translate(40, 150)">
        <text 
          x="0" y="0" 
          font-size="52" 
          font-weight="bold" 
          fill="${textColor}"
          font-family="Arial, sans-serif"
          word-spacing="width: 1000px"
          max-width="1000"
        >
          ${escapeXml(displayTitle)}
        </text>
      </g>
      
      <!-- Subtitle -->
      <g transform="translate(40, 380)">
        <text 
          x="0" y="0" 
          font-size="24" 
          fill="${textColor}"
          opacity="0.9"
          font-family="Arial, sans-serif"
        >
          ${escapeXml(displaySubtitle)}
        </text>
      </g>
      
      <!-- Bottom branding -->
      <rect y="${height - 40}" width="${width}" height="40" fill="${accentColor}" opacity="0.2"/>
      <text 
        x="20" y="${height - 15}" 
        font-size="16" 
        fill="${textColor}"
        font-weight="bold"
        font-family="Arial, sans-serif"
      >
        KOT Tech News
      </text>
    </svg>
  `;

  return svg;
}

async function addImageOverlay(
  baseBuffer: Buffer,
  imageUrl: string,
  width: number,
  height: number
): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

    const imageBuffer = await response.buffer();

    // Resize and composite
    const resizedImage = await sharp(imageBuffer)
      .resize(600, 315, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();

    return await sharp(baseBuffer)
      .composite([
        {
          input: resizedImage,
          top: 157,
          left: 300,
        },
      ])
      .png()
      .toBuffer();
  } catch (error) {
    console.warn("Could not add image overlay:", error);
    return baseBuffer;
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function saveImageToFile(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const publicDir = join(process.cwd(), "public", "generated");
  const filePath = join(publicDir, filename);

  writeFileSync(filePath, imageBuffer);
  return `/generated/${filename}`;
}
