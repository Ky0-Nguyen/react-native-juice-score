#import "RnJuicyScore.h"
@import JuicyScoreFramework;
#import "JuicyScorePrivate.h"

@implementation RnJuicyScore

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(getToken,
                 getTokenWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^(void) {
        [[JuicyScore sharedInstance] getSessionId:^(NSString *token) {
            resolve(token);
        }];
    });
}

RCT_REMAP_METHOD(create,
                 createWithArguments: (nonnull NSDictionary*)arguments
                 createWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    bool geo = true;
    bool sendMac = true;
    bool sendDeviceHash = true;

    if (arguments[@"collectGeoInfo"]) {
        geo = [arguments[@"collectGeoInfo"] boolValue];
    }

    if (arguments[@"collectMacAddress"]) {
        sendMac = [arguments[@"collectMacAddress"] boolValue];
    }

    dispatch_async(dispatch_get_main_queue(), ^(void) {
        [[JuicyScore sharedInstance] createWithSendGeo:geo sendMac:sendMac sendDeviceHash:sendDeviceHash];

        if (arguments[@"debug"] && [arguments[@"debug"] boolValue]) {
            [[JuicyScore sharedInstance] setDebug:YES];
        }

        if (arguments[@"scanPorts"] && [arguments[@"scanPorts"] boolValue]) {
            [[JuicyScore sharedInstance] startCollectPorts];
        }

        [[JuicyScore sharedInstance] setOnInitComplete:^(void) {
            resolve(@"");
        }];
    });
}

RCT_REMAP_METHOD(setOnInitComplete,
                 setOnInitCompleteWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [[JuicyScore sharedInstance] setOnInitComplete:^(void) {
        resolve(@"");
    }];
}

RCT_REMAP_METHOD(setDebug,
                 setDebugWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [[JuicyScore sharedInstance] setDebug:YES];
    resolve(@"");
}

RCT_REMAP_METHOD(getJuicyScoreVersion,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^(void) {
        [[JuicyScore sharedInstance] getJuicyScoreVersion:^(NSString *version) {
            resolve(version);
        }];
    });
}

RCT_EXPORT_METHOD(pause)
{
    [[JuicyScore sharedInstance] pause];
}

RCT_EXPORT_METHOD(resume)
{
    dispatch_async(dispatch_get_main_queue(), ^(void) {
        [[JuicyScore sharedInstance] resume];
    });
}

RCT_EXPORT_METHOD(startCollectPorts)
{
    dispatch_async(dispatch_get_main_queue(), ^(void) {
        [[JuicyScore sharedInstance] startCollectPorts];
    });
}

RCT_REMAP_METHOD(setQuarters, createWithPoint: (nonnull NSDictionary*)arguments)
{
    float x = [[arguments objectForKey:@"x"] floatValue];
    float y = [[arguments objectForKey:@"y"] floatValue];
    CGPoint point = CGPointMake(x, y);

    [[self getJuicyPrivate] detectQuarterFromPoint:point];
}

RCT_EXPORT_METHOD(onSingleClick)
{
    [[self getJuicyPrivate] detectSingleTap];
}

RCT_EXPORT_METHOD(onDoubleClick)
{
    [[self getJuicyPrivate] detectDoubleTap];
}

RCT_REMAP_METHOD(setScrollDistance, createWithDistance: (nonnull NSDictionary*)arguments)
{
    float distance = [[arguments objectForKey:@"distance"] floatValue];
    float time = [[arguments objectForKey:@"time"] floatValue];

    [[self getJuicyPrivate] setScrollDistanceWithDistance:distance distanceTime:time];
}

RCT_REMAP_METHOD(setButtonDispersion, createWithDisperation: (nonnull NSDictionary*)arguments)
{
    float deltaX = [[arguments objectForKey:@"deltaX"] floatValue];
    float deltaY = [[arguments objectForKey:@"deltaY"] floatValue];
    [[self getJuicyPrivate] setButtonDisperationWithDeltaX:deltaX deltaY:deltaY];
}

RCT_EXPORT_METHOD(onMinimizeApp)
{
    [[self getJuicyPrivate] detectLeavePage];
}

-(id<JuicyScorePrivate>) getJuicyPrivate {
    return (id<JuicyScorePrivate>) [JuicyScore sharedInstance];
}

@end
