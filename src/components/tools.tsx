import Icon from "@ant-design/icons";
import assertNever from "assert-never";
import { OrderedMap, Record, RecordOf, Set } from "immutable";
import { TFile } from "obsidian";
import React, { PropsWithChildren } from "react";
import { FaMarkdown } from "react-icons/fa";
import {
  FcAudioFile,
  FcDocument,
  FcFile,
  FcImageFile,
  FcVideoFile,
} from "react-icons/fc";

export const getFileType = (ext: string): FileType => {
  const img = ["bmp", "png", "jpg", "jpeg", "gif", "svg"],
    audio = ["mp3", "wav", "m4a", "3gp", "flac", "ogg", "oga"],
    video = ["mp4", "webm", "ogv"];

  if (ext === "md") return FileType.md;
  if (img.includes(ext)) return FileType.img;
  if (audio.includes(ext)) return FileType.audio;
  if (video.includes(ext)) return FileType.video;
  if (ext === "pdf") return FileType.pdf;
  return FileType.other;
};
export enum FileType {
  md,
  pdf,
  img,
  video,
  audio,
  other,
}
export enum LinkType {
  /** Children of folder */
  hard,
  /** outgoing, defined within the target file */
  softOut,
  /** incoming link to target file, defined in external file */
  softIn,
}
/** Defined in front-matter/ Dataview inline fields*/
export type SoftLink = LinkType.softIn | LinkType.softOut;
export const isSoftLink = (type: LinkType): type is SoftLink =>
  type !== LinkType.hard;

export const ObInternalLink = ({
  linktext,
  children,
}: PropsWithChildren<{ linktext: string }>) => (
  <a
    className="internal-link"
    data-href={linktext}
    href={linktext}
    target="_blank"
    rel="noopener"
    style={{ color: "var(--text-normal)", textDecoration: "none" }}
  >
    {children}
  </a>
);
export const ObTag = ({ tag }: { tag: string }) => (
  <a
    className="tag"
    href={tag}
    target="_blank"
    rel="noopener"
    style={{
      color: "var(--text-normal)",
      textDecoration: "none",
      margin: 0,
      padding: 0,
    }}
  >
    {tag.substring(1)}
  </a>
);

export const getIcon = (type: FileType) => {
  let icon: JSX.Element;
  switch (type) {
    case FileType.md:
      icon = <FaMarkdown />;
      break;
    case FileType.pdf:
      icon = <FcDocument />;
      break;
    case FileType.img:
      icon = <FcImageFile />;
      break;
    case FileType.video:
      icon = <FcVideoFile />;
      break;
    case FileType.audio:
      icon = <FcAudioFile />;
      break;
    case FileType.other:
      icon = <FcFile />;
      break;
    default:
      assertNever(type);
  }
  return <Icon component={() => icon} style={{ fontSize: "1.5em" }} />;
};

interface FileInfoProps {
  file: TFile;
  types: Set<LinkType>;
}
export type FileInfo = RecordOf<FileInfoProps>;
export const FileInfo = Record<FileInfoProps>({
  // @ts-ignore
  file: {},
  types: Set([LinkType.hard]),
}) as unknown as (values: { file: TFile; types?: Set<LinkType> }) => FileInfo;

export type Path_Types = OrderedMap<string, FileInfo>;
