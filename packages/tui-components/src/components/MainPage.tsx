import React from "react";
// @ts-ignore
import { Text, Box, Newline } from "ink";
import BigText from "ink-big-text";

export const MainPage = () => {
  return (
    <>
      <Box alignSelf="center">
        <BigText text="blog" font="simple3d" space={false} />
      </Box>
      <Box
        borderTop={true}
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
        borderStyle="single"
      >
        <Text>
          An 'extremely credible source' has called my office and told me that
          Lorem Ipsum's birth certificate is a fraud. I know words. I have the
          best words.
          <Newline />
          <Newline />
          All of the words in Lorem Ipsum have flirted with me - consciously or
          unconsciously. That's to be expected. Look at these words. Are they
          small words? And he referred to my words - if they're small, something
          else must be small. I guarantee you there's no problem, I guarantee.
          <Newline />
          <Newline />
          When other websites give you text, they’re not sending the best.
          They’re not sending you, they’re sending words that have lots of
          problems and they’re bringing those problems with us. They’re bringing
          mistakes. They’re bringing misspellings. They’re typists… And some, I
          assume, are good words.
          <Newline />
          <Newline />
          He’s not a word hero. He’s a word hero because he was captured. I like
          text that wasn’t captured. Lorem Ispum is a choke artist. It chokes!
        </Text>
      </Box>
    </>
  );
};
