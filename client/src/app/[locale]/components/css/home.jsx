"use client";

import flex from "@/app/components/css/Flexbox";
import media from "@/app/components/css/Media";
import Link from "next/link";
import { styled, css } from "styled-components";

const Section = styled.section`
  width: 100%;
  min-height: 50vh;
  color: var(--color-text);
  text-aitemgn: center;
  margin-bottom: 10vh;
  position: relative;
  overflow: visible;

  ${flex({
    AItemgnItems: "flex-start",
  })};
`;

const Title = styled.h2.attrs((props) => ({ title: props.children }))`
  font-size: ${(props) => props.fs || "2rem"};
  position: relative;
  padding-left: 5px;
  width: 100%;
  margin-bottom: 1rem;

  ${media(
    { "min-width": "xl" },
    css`
      font-size: ${(props) => props.xl || "2.2rem"};
    `
  )}
`;

const Img = styled.img.attrs((props) => ({
  alt: props.src,
}))`
  width: calc(var(--first-fibo) * 8);
  height: auto;
  border-radius: 1rem;
  box-shadow: 0px 0.5rem 1rem 5px var(--color-bg);
  margin: 0 1rem;
  position: relative;
  top: 0;
  left: 0;
`;

const List = styled.ul`
  width: 100%;
  min-height: 30vh;
  itemst-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(3, auto);
  gap: 2rem 1rem;
  padding: 0.5rem 1rem;

  ${media(
    {
      "max-width": "md",
    },
    css`
      grid-template-columns: auto;
      grid-template-rows: repeat(6, auto);
      padding: 2rem;
    `
  )}
`;

const Item = styled.li`
  text-align: center;
  cursor: pointer;
  border-radius: 1rem;
  transition: all 1s var(--animation);

  &:hover {
    transform: scale(1.1);
    background-color: var(--color-bg);
    padding: 0.5rem;
    box-shadow: 0px 0.5rem 1rem 2px var(--color-bg);
  }
`;

const Icon = styled.i`
  font-size: 2rem;
`;

const A = styled(Link).attrs((props) => ({ title: props.children }))`
  width: 90%;
  text-align: center;
  text-decoration: none;
  font-size: 2rem;
  background-color: var(--color-bg);
  padding: 1rem;
  border-radius: 1rem;
  transition: all 1s var(--animation);

  &:hover {
    transform: translateY(-1rem);
    box-shadow: 0px 0.5rem 1rem 2px rgba(var(--color-bg-rgb), 0.7);
  }
`;

const P = styled.p.attrs((props) => ({
  title: props.children.slice(0, 50).trim() + "...",
}))`
  font-size: 1.5rem;
`;

export { Section, Title, Img, List, Item, Icon, A, P };
