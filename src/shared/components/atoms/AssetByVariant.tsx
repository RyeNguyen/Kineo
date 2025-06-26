/* eslint-disable no-console */
import type { ImageProps, ImageSourcePropType } from 'react-native';

import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { z } from 'zod';

import getAssetsContext from '@/assets/getAssetsContext';
import useTheme from '@/shared/hook/useTheme';

type Props = {
  extension?: string;
  path: string;
} & Omit<ImageProps, 'source'>;

const images = getAssetsContext('images');

function AssetByVariant({ extension = 'png', path, ...props }: Props) {
  const [image, setImage] = useState<ImageSourcePropType>();
  const { variant } = useTheme();

  useEffect(() => {
    try {
      const defaultSource = z
        .custom<ImageSourcePropType>()
        .parse(images(`./${path}.${extension}`));

      if (variant === 'default') {
        setImage(defaultSource);
        return;
      }

      try {
        const fetchedModule = z
          .custom<ImageSourcePropType>()
          .parse(images(`./${variant}/${path}.${extension}`));
        setImage(fetchedModule);
      } catch (error) {
        console.warn(
          `Couldn't load the image: ${path}.${extension} for the variant ${variant}, Fallback to default`,
          error,
        );
        setImage(defaultSource);
      }
    } catch (error) {
      console.error(`Couldn't load the image: ${path}`, error);
    }
  }, [variant, extension, path]);

  return image && <Image source={image} testID="variant-image" {...props} />;
}

export default AssetByVariant;
