#import <Foundation/Foundation.h>
@import JuicyScoreFramework;

@protocol JuicyScorePrivate <NSObject>

- (void) setDebug:(BOOL)newDebug;
- (NSString *)getLogText;
- (void) detectSingleTap;
- (void)getSessionId:(void (^)(NSString *))completion;
- (NSString *)getSavedDataId;
- (void)detectDoubleTap;
- (void)setButtonDisperationWithDeltaX:(float)deltaX deltaY:(float)deltaY;
- (void)setMouseSpeedWithDistance:(float)distance distanceTime:(float)distanceTime;
- (void)setScrollDistanceWithDistance:(float)distance distanceTime:(float)distanceTime;
- (void)setReadTime:(float)time;
- (void)setTouchRadius:(float)radius;
- (void)detectQuarterFromPoint:(CGPoint)point;
- (void)detectCut;
- (void)detectCopy;
- (void)detectPaste;
- (void)pause;

- (void)startCollectPorts;
- (void)resume;
- (void)detectLeavePage;

@end
