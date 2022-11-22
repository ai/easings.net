declare type EasingFunction = (progress: number) => number;
interface EasingDictionary {
    [easing: string]: EasingFunction;
}
declare const easingsFunctions: EasingDictionary;
export default easingsFunctions;
