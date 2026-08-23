/**
 * ZoomableGrid — pinch-to-zoom viewport for the seedling grid.
 *
 * Wraps grid content (rows of cells) in a clipped box that can be
 * pinch-zoomed and, once zoomed, panned around with two fingers. Zoom/pan
 * gestures require two pointers, so single-finger taps and drags on the
 * cells underneath (tap-to-select, drag-and-drop) pass through untouched.
 *
 * Used by GridPreview and GridEdit so grids with many seedlings can be
 * zoomed in for easier tapping/dragging of individual cells.
 */

import { ThemedText } from '@/components/themed-text';
import { zoomStyles } from '@/styles/zoomable-grid';
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const MIN_SCALE = 1;
const MAX_SCALE = 3;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export default function ZoomableGrid({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  const scale           = useSharedValue(1);
  const savedScale       = useSharedValue(1);
  const translateX       = useSharedValue(0);
  const translateY       = useSharedValue(0);
  const savedTranslateX  = useSharedValue(0);
  const savedTranslateY  = useSharedValue(0);
  const contentWidth     = useSharedValue(0);
  const contentHeight    = useSharedValue(0);

  const clampTranslation = () => {
    'worklet';
    const maxX = Math.max(0, (contentWidth.value * (scale.value - 1)) / 2);
    const maxY = Math.max(0, (contentHeight.value * (scale.value - 1)) / 2);
    translateX.value = clamp(translateX.value, -maxX, maxX);
    translateY.value = clamp(translateY.value, -maxY, maxY);
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      clampTranslation();
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(setIsZoomed)(scale.value > MIN_SCALE + 0.01);
    });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      clampTranslation();
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleContentLayout = useCallback((e: LayoutChangeEvent) => {
    contentWidth.value  = e.nativeEvent.layout.width;
    contentHeight.value = e.nativeEvent.layout.height;
  }, [contentWidth, contentHeight]);

  const handleReset = () => {
    scale.value          = withTiming(MIN_SCALE);
    savedScale.value      = MIN_SCALE;
    translateX.value      = withTiming(0);
    translateY.value      = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    setIsZoomed(false);
  };

  return (
    <View style={[zoomStyles.viewport, style]}>
      <GestureDetector gesture={composedGesture}>
        <View style={[zoomStyles.clip, isZoomed && zoomStyles.clipZoomed]} collapsable={false}>
          <Animated.View onLayout={handleContentLayout} style={animatedStyle}>
            {children}
          </Animated.View>
        </View>
      </GestureDetector>

      {isZoomed && (
        <TouchableOpacity style={zoomStyles.resetButton} onPress={handleReset} activeOpacity={0.8}>
          <ThemedText style={zoomStyles.resetButtonText}>↺ Reset zoom</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}
