import { AlignmentOptions as AlignmentOptions_2 } from './components/abstractions';
import { BreakMode as BreakMode_2 } from './components/abstractions';
import { ButtonThemeColor as ButtonThemeColor_2 } from './components/abstractions';
import { ButtonType as ButtonType_2 } from './components/abstractions';
import { ButtonVariant as ButtonVariant_2 } from './components/abstractions';
import { CSSProperties } from 'react';
import { default as default_2 } from 'react';
import { default as default_3 } from 'react/jsx-runtime';
import { DefaultToastOptions } from 'react-hot-toast';
import { DelayMode } from 'msw';
import { Dispatch } from 'react';
import { ErrorInfo } from 'react';
import { ForwardedRef } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { IconBaseProps as IconBaseProps_2 } from './components/Icon/IconNative';
import { IconPosition as IconPosition_2 } from './components/abstractions';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { LayoutContext as LayoutContext_2 } from './abstractions/RendererDefs';
import { MemoExoticComponent } from 'react';
import { NavigateOptions } from 'react-router-dom';
import { OrientationOptions as OrientationOptions_2 } from './components/abstractions';
import { OverflowMode as OverflowMode_2 } from './components/abstractions';
import { QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';
import { RefObject } from 'react';
import { Renderable } from 'react-hot-toast';
import { RenderChildFn as RenderChildFn_2 } from './abstractions/RendererDefs';
import { Root } from 'react-dom/client';
import { ScrollStyle as ScrollStyle_2 } from './components/ScrollViewer/Scroller';
import { SetStateAction } from 'react';
import { SetupWorker } from 'msw/browser';
import { SizeType as SizeType_2 } from './components/abstractions';
import { Tab as Tab_2 } from './components/abstractions';
import { TextVariant as TextVariant_2 } from './components/abstractions';
import { To } from 'react-router-dom';
import { Toast } from 'react-hot-toast';
import { ToastOptions } from 'react-hot-toast';
import { ToneSwitchProps as ToneSwitchProps_2 } from './components/ToneSwitch/ToneSwitchNative';
import { TooltipOptions as TooltipOptions_2 } from './components/Tooltip/TooltipNative';
import { UpdateStateFn as UpdateStateFn_2 } from './abstractions/RendererDefs';
import { UseEventOverload as UseEventOverload_2 } from './components-core/utils/misc';
import { ValidationStatus as ValidationStatus_2 } from './components/abstractions';
import { ValueOrFunction } from 'react-hot-toast';

declare interface ActionExecutionContext {
    uid: symbol;
    state: ContainerState;
    getCurrentState: () => ContainerState;
    appContext: AppContextObject;
    apiInstance?: IApiInterceptor;
    lookupAction: LookupAsyncFnInner;
    navigate: any;
    location: any;
}

declare type ActionFunction = (executionContext: ActionExecutionContext, ...args: any[]) => any;

declare type AlignmentOptions = (typeof alignmentOptionValues)[number];

declare const alignmentOptionValues: readonly ["start", "center", "end"];

declare interface AndCondition extends ConditionBase {
    type: "and";
    conditions: BehaviorCondition[];
}

declare type ApiInterceptorDefinition = {
    type?: string;
    config?: Record<string, any>;
    artificialDelay?: number | DelayMode;
    schemaDescriptor?: SchemaDescriptor;
    apiUrl?: string;
    initialData?: Record<string, any[]> | (() => Promise<Record<string, any[]>>);
    helpers?: Record<string, any>;
    initialize?: string;
    operations?: Record<string, InterceptorOperationDef>;
    auth?: AuthDefinition;
    useWorker?: boolean;
};

declare function ApiInterceptorProvider({ interceptor, children, parentInterceptorContext, waitForApiInterceptor, }: Props_4): JSX_2.Element;

declare type AppContextObject = {
    [x: string]: unknown;
    version: string;
    Actions: Record<string, ActionFunction>;
    apiInterceptorContext: IApiInterceptorContext;
    appGlobals?: Record<string, any>;
    debugEnabled?: boolean;
    decorateComponentsWithTestId?: boolean;
    environment: {
        isWindowFocused: boolean;
    };
    mediaSize: MediaSize;
    queryClient: QueryClient | null;
    standalone?: boolean;
    appIsInShadowDom?: boolean;
    formatDate: (date: string | Date) => string | undefined;
    formatDateTime: (date: any) => string | undefined;
    formatDateWithoutYear: (date: string | Date) => string | undefined;
    formatTime: (date: any) => string | undefined;
    formatTimeWithoutSeconds: (date: string | Date) => string | undefined;
    getDate: (date?: string | number | Date) => Date;
    getDateUntilNow: (date?: string | number | Date, nowLabel?: string, time?: string) => string;
    isoDateString: (date?: string) => string;
    isToday: (date: string | Date) => boolean;
    isTomorrow: (date: string | Date) => boolean;
    isYesterday: (date: string | Date) => boolean;
    smartFormatDate: (date?: string | number | Date) => string;
    smartFormatDateTime: (date: string | Date) => string | undefined;
    differenceInMinutes: (date1: number | Date, date2: number | Date) => number;
    isSameDay: (dateLeft: number | Date, dateRight: number | Date) => boolean;
    isThisYear: (date: Date | number) => boolean;
    formatHumanElapsedTime: (date: string | Date) => string;
    avg: (values: number[], decimals?: number) => number;
    sum: (values: number[]) => number;
    formatFileSizeInBytes: (bytes: number) => string | undefined;
    getFileExtension: (fileName: string) => string | undefined;
    navigate: (url: To, options?: NavigateOptions) => void;
    routerBaseName: string;
    setNavigationHandlers?: (onWillNavigate?: (to: string | number, queryParams?: Record<string, any>) => false | void | null | undefined, onDidNavigate?: (to: string | number, queryParams?: Record<string, any>) => void) => void;
    confirm: (title: string, message?: string, actionLabel?: string) => Promise<boolean>;
    signError(error: Error | string): void;
    toast: {
        (message: Message, opts?: ToastOptions): string;
        error: ToastHandler;
        success: ToastHandler;
        loading: ToastHandler;
        custom: ToastHandler;
        dismiss(toastId?: string): void;
        remove(toastId?: string): void;
        promise<T>(promise: Promise<T>, msgs: {
            loading: Renderable;
            success: ValueOrFunction<Renderable, T>;
            error: ValueOrFunction<Renderable, any>;
        }, opts?: DefaultToastOptions): Promise<T>;
    };
    activeThemeId: string;
    activeThemeTone: "light" | "dark";
    availableThemeIds: string[];
    setTheme: (themId: string) => void;
    setThemeTone: (newTone: "light" | "dark") => void;
    toggleThemeTone: () => void;
    getThemeVar: (themeVar: string) => string | undefined;
    loggedInUser: LoggedInUserDto | null;
    setLoggedInUser: (loggedInUser: any) => void;
    readonly resources?: Record<string, string>;
    capitalize: (s?: string) => string;
    pluralize: (number: number, singular: string, plural: string) => string;
    delay: (timeInMs: number, callback?: any) => Promise<void>;
    debounce: <F extends (...args: any[]) => any>(delayMs: number, func: F, ...args: any[]) => void;
    toHashObject: (arr: any[], keyProp: string, valueProp: string) => any;
    findByField: (arr: any[], field: string, value: any) => any;
    readonly embed: {
        isInIFrame: boolean;
    };
    distinct: (arr: any[]) => any[];
    forceRefreshAnchorScroll: () => void;
    scrollBookmarkIntoView: (bookmarkId: string, smoothScrolling?: boolean) => void;
    AppState: AppState;
    pubSubService: PubSubService;
    publishTopic: (topic: string | number, data?: any) => void;
};

declare const appLayoutNames: readonly ["vertical", "vertical-sticky", "vertical-full-header", "condensed", "condensed-sticky", "horizontal", "horizontal-sticky", "desktop"];

declare type AppLayoutType = (typeof appLayoutNames)[number];

/**
 * This component is responsible for running a pre-compiled xmlui app. It
 * receives the internal representation of the app markup and code (coming
 * from either code-behind files or inlined markup expressions) and executes
 * the app accordingly.
 */
declare function AppRoot({ apiInterceptor, contributes, node, decorateComponentsWithTestId, debugEnabled, defaultTheme, defaultTone, resources, globalProps, globalVars, standalone, trackContainerHeight, routerBaseName, previewMode, resourceMap, sources, extensionManager, children, projectCompilation, isNested, onInit, icons }: AppWrapperProps & {
    extensionManager?: StandaloneExtensionManager;
    isNested?: boolean;
}): JSX_2.Element;

/**
 * AppState type definition for global state management
 */
declare type AppState = {
    define(bucket: string, initialState: any): any;
    get(bucket: string, path?: string): any;
    set(bucket: string, pathOrValue: string | any, value?: any): any;
    update(bucket: string, pathOrUpdater: string | Function | any, updater?: Function | ((prev: any) => any | Promise<any>)): Promise<any>;
    updateWith(bucket: string, updater: (prev: any) => any | Promise<any>): Promise<any>;
    remove(bucket: string, value: any): void;
    removeBy(bucket: string, predicate: (item: any) => boolean | Promise<boolean>): Promise<void>;
    removeAt(bucket: string, index: number): any;
    append(bucket: string, value: any): any;
    push(bucket: string, value: any): any;
    pop(bucket: string): any;
    shift(bucket: string): any;
    unshift(bucket: string, value: any): any;
    insertAt(bucket: string, index: number, value: any): any;
};

declare type AppThemes = {
    setActiveThemeId: (newThemeId: string) => void;
    setActiveThemeTone: (newTone: ThemeTone) => void;
    toggleThemeTone: () => void;
    activeThemeId: string;
    activeThemeTone: ThemeTone;
    themes: Array<ThemeDefinition>;
    resources: Record<string, string>;
    resourceMap: Record<string, string>;
    availableThemeIds: Array<string>;
    activeTheme: ThemeDefinition;
};

declare type AppWrapperProps = {
    node: ComponentLike;
    previewMode?: boolean;
    routerBaseName?: string;
    contributes?: ContributesDefinition;
    globalProps?: GlobalProps;
    globalVars?: Record<string, any>;
    resources?: Record<string, string>;
    standalone?: boolean;
    trackContainerHeight?: TrackContainerHeight;
    decorateComponentsWithTestId?: boolean;
    debugEnabled?: boolean;
    apiInterceptor?: ApiInterceptorDefinition;
    defaultTheme?: string;
    defaultTone?: ThemeTone;
    resourceMap?: Record<string, string>;
    sources?: Record<string, string>;
    projectCompilation?: ProjectCompilation;
    children?: ReactNode;
    onInit?: () => void;
    icons?: Record<string, string>;
};

declare type ARRAY_DESTRUCTURE = typeof T_ARRAY_DESTRUCTURE;

declare type ARRAY_LITERAL = typeof T_ARRAY_LITERAL;

declare interface ArrayDestructure extends DestructureBase {
    type: ARRAY_DESTRUCTURE;
}

declare interface ArrayLiteral extends ExpressionBase {
    type: ARRAY_LITERAL;
    items: Expression[];
    loose?: boolean;
}

declare type ARROW_EXPRESSION = typeof T_ARROW_EXPRESSION;

declare type ARROW_EXPRESSION_STATEMENT = typeof T_ARROW_EXPRESSION_STATEMENT;

declare interface ArrowExpression extends ExpressionBase {
    type: ARROW_EXPRESSION;
    name?: string;
    args: Expression[];
    statement: Statement;
    async?: boolean;
}

declare interface ArrowExpressionStatement extends ScripNodeBase {
    type: ARROW_EXPRESSION_STATEMENT;
    expr: ArrowExpression;
}

declare type ASSIGNMENT_EXPRESSION = typeof T_ASSIGNMENT_EXPRESSION;

declare interface AssignmentExpression extends ExpressionBase {
    type: ASSIGNMENT_EXPRESSION;
    leftValue: Expression;
    op: AssignmentSymbols;
    expr: Expression;
}

declare type AssignmentSymbols = "=" | "+=" | "-=" | "**=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=" | "&&=" | "||=" | "??=";

declare type ASYNC_FUNCTION_DECLARATION = typeof T_ASYNC_FUNCTION_DECLARATION;

declare type AsyncFunction = (...args: any) => Promise<any> | any;

declare type AuthDefinition = {
    defaultLoggedInUser?: any;
};

declare type AWAIT_EXPRESSION = typeof T_AWAIT_EXPRESSION;

declare interface AwaitExpression extends ExpressionBase {
    type: AWAIT_EXPRESSION;
    expr: Expression;
}

/**
 * Defines the shape of a component behavior that can wrap a component with
 * additional functionality.
 */
declare interface Behavior {
    /**
     * The metadata that describes the behavior, including its trigger properties and
     */
    metadata: BehaviorMetadata;
    /**
     * A function that determines if the behavior should be applied based on the
     * component's context and props.
     * @param context The renderer context of the component.
     * @param node The component definition.
     * @param metadata The metadata of the component.
     * @returns True if the behavior can be attached, otherwise false.
     */
    canAttach: (context: RendererContext<any>, node: ComponentDef, metadata: ComponentMetadata) => boolean;
    /**
     * A function that attaches the behavior to the component's React node.
     * @param context The renderer context of the component.
     * @param node The React node to attach.
     * @param metadata The metadata of the component.
     * @returns The attached React node.
     */
    attach: (context: RendererContext<any>, node: ReactNode, metadata?: ComponentMetadata) => ReactNode;
}

declare type BehaviorCondition = AndCondition | OrCondition | NotCondition | VisualCondition | NonVisualCondition | hasPropCondition | hasNoPropCondition | PropEqualsCondition | PropContainsCondition | PropNotEqualsCondition | hasApiCondition | hasNoApiCondition | hasContextVarCondition | hasNoContextVarCondition | hasEventCondition | hasNoEventCondition | isTypeCondition | isNotTypeCondition;

declare type BehaviorMetadata = {
    name: string;
    friendlyName?: string;
    description: string;
    triggerProps: string[];
    props: Record<string, ComponentPropertyMetadata>;
    condition?: BehaviorCondition;
};

declare type BINARY_EXPRESSION = typeof T_BINARY_EXPRESSION;

declare interface BinaryExpression extends ExpressionBase {
    type: BINARY_EXPRESSION;
    op: BinaryOpSymbols;
    left: Expression;
    right: Expression;
}

declare type BinaryOpSymbols = "**" | "*" | "/" | "%" | "+" | "-" | "<<" | ">>" | ">>>" | "<" | "<=" | ">" | ">=" | "==" | "===" | "!=" | "!==" | "&" | "|" | "^" | "&&" | "||" | "??" | "in";

declare type BLOCK_STATEMENT = typeof T_BLOCK_STATEMENT;

declare interface BlockStatement extends ScripNodeBase {
    type: BLOCK_STATEMENT;
    stmts: Statement[];
}

declare type BREAK_STATEMENT = typeof T_BREAK_STATEMENT;

declare type BreakMode = (typeof BreakModeKeys)[number];

declare const BreakModeKeys: readonly ["normal", "word", "anywhere", "keep", "hyphenate"];

declare const Breakout: ({ children, style, ...rest }: Props_6) => JSX_2.Element;

declare interface BreakStatement extends ScripNodeBase {
    type: BREAK_STATEMENT;
}

declare const builtInThemes: Array<ThemeDefinition>;

declare const Button: default_2.ForwardRefExoticComponent<{
    id?: string;
    type?: ButtonType;
    variant?: ButtonVariant;
    themeColor?: ButtonThemeColor;
    size?: SizeType;
    disabled?: boolean;
    children?: default_2.ReactNode | default_2.ReactNode[];
    icon?: default_2.ReactNode;
    iconPosition?: IconPosition;
    contentPosition?: AlignmentOptions;
    orientation?: OrientationOptions;
    formId?: string;
    style?: CSSProperties;
    gap?: string | number;
    autoFocus?: boolean;
    contextualLabel?: string;
} & Pick<default_2.HTMLAttributes<HTMLButtonElement>, "className" | "aria-disabled" | "aria-label" | "aria-controls" | "aria-expanded" | "tabIndex" | "role" | "onFocus" | "onBlur" | "onClick" | "onContextMenu" | "onMouseEnter" | "onMouseLeave"> & default_2.RefAttributes<HTMLButtonElement>>;

declare type ButtonThemeColor = (typeof buttonThemeValues)[number];

declare const buttonThemeValues: readonly ["attention", "primary", "secondary"];

declare type ButtonType = (typeof buttonTypeValues)[number];

declare const buttonTypeValues: readonly ["button", "submit", "reset"];

declare type ButtonVariant = (typeof buttonVariantValues)[number];

declare const buttonVariantValues: readonly ["solid", "outlined", "ghost"];

declare type CALCULATED_MEMBER_ACCESS_EXPRESSION = typeof T_CALCULATED_MEMBER_ACCESS_EXPRESSION;

declare interface CalculatedMemberAccessExpression extends ExpressionBase {
    type: CALCULATED_MEMBER_ACCESS_EXPRESSION;
    obj: Expression;
    member: Expression;
}

declare type callbackType = (...args: Array<any>) => any;

declare type CodeDeclaration = {
    source?: string;
    tree: Expression;
    [x: string]: unknown;
};

declare type CollectedDeclarations = {
    vars: Record<string, CodeDeclaration>;
    functions: Record<string, CodeDeclaration>;
    moduleErrors?: ModuleErrors;
    hasInvalidStatements?: boolean;
};

declare type ColorDef = {
    name: string;
    format: "hex" | "rgb" | "hsl";
};

declare type CompilationUnit = {
    /** The file name */
    filename: string;
    /** Optional markup source (used in dev mode) */
    markupSource?: string;
    /** Optional code behind source (used in dev mode) */
    codeBehindSource?: string;
    /** Other (non-core) component names this component depends on */
    dependencies: Set<string>;
};

/**
 * Components can provide an API that other components can invoke (using
 * the host component ID). This type defines the shape of a hash object that
 * stores the API endpoints.
 */
declare type ComponentApi = Record<string, ((...args: any[]) => any) | boolean | number | string>;

declare type ComponentApiMetadata = {
    readonly description: string;
    readonly signature?: string;
    readonly parameters?: Record<string, string>;
};

declare type ComponentCompilation = CompilationUnit & {
    /** The compiled markup of the component file */
    definition: CompoundComponentDef;
};

declare interface ComponentDef<TMd extends ComponentMetadata = ComponentMetadata> extends ComponentDefCore, Scriptable {
    props?: Record<keyof TMd["props"], any>;
    events?: Record<keyof TMd["events"], any>;
    api?: Record<keyof TMd["apis"], any>;
    contextVars?: Record<keyof TMd["contextVars"], string>;
}

/**
 * This interface represents the core properties of a component definition
 * (independent of component metadata).
 */
declare interface ComponentDefCore {
    /**
     * The type discriminator field of the component; it defines the unique ID of the component type.
     */
    type: string;
    /**
     * Unique identifier of a component-like object
     */
    uid?: string;
    /**
     * An optional identifier we use for e2e tests; it does not influence the rendering of a component.
     */
    testId?: string;
    /**
     * Though components manage their state internally, the app logic may require user
     * state management. Components may have user *variables*, which the UI logic uses to
     * manage the application state. This property holds the variables (name and value
     * pairs) associated with this component definition.
     */
    vars?: Record<string, any>;
    /**
     * Global variables that flow down to all child containers regardless of the `uses`
     * property. These variables are shared across the entire application and updates
     * to them propagate back to the root container where they are defined.
     * Only the root container should define globalVars.
     */
    globalVars?: Record<string, any>;
    /**
     * Each component may have child components to constitute a hierarchy of components.
     * This property holds the definition of these nested children.
     */
    children?: ComponentDef[];
    /**
     * Components may have slots that can be filled with other components. This property
     * holds the contents of the slots.
     */
    slots?: Record<string, ComponentDef[]>;
    /**
     * This property is evaluated to a Boolean value during run time. When this value is
     * `true`, the component with its children chain is rendered; otherwise, the entire
     * component hierarchy is omitted from the rendered tree.
     */
    when?: string | boolean;
    /**
     * Some components work with data obtained asynchronously. Fetching this data requires
     * some state management handling the complexity (including error handling) of data
     * access. A *loader* is responsible for managing this logic. This property holds the
     * loaders associated with this component definition.
     */
    loaders?: ComponentDef[];
    /**
     * Components may have functions that are used to perform some logic. This property
     * holds the functions (name and function body) associated with this component
     * definition.
     */
    functions?: Record<string, any>;
    /**
     * Components managing state through variables or loaders are wrapped with containers
     * responsible for this job. Just as components, containers form a hierarchy. While
     * working with this hierarchy, parent components may flow state values (key and value
     * pairs) to their child containers. This property holds the name of state values to
     * flow down to the direct child containers.
     */
    uses?: string[];
    /**
     * Arbitrary debug information that can be attached to a component definition.
     * Current usage:
     * - `debug: { source: { start: number, end: number } }` The start and end
     *   positions of the source belonging to the particular component definition.
     */
    debug?: Record<string, any>;
}

declare type ComponentEventMetadata = {
    readonly description: string;
    readonly signature?: string;
    readonly parameters?: Record<string, string>;
};

declare type ComponentExtension = ComponentRendererDef | CompoundComponentRendererInfo;

declare type ComponentLike = ComponentDef | CompoundComponentDef;

declare type ComponentMetadata<TProps extends Record<string, ComponentPropertyMetadata> = Record<string, any>, TEvents extends Record<string, ComponentEventMetadata> = Record<string, any>, TContextValues extends Record<string, ComponentPropertyMetadata> = Record<string, any>, TApis extends Record<string, ComponentApiMetadata> = Record<string, any>> = {
    status?: "stable" | "experimental" | "deprecated" | "in progress" | "internal";
    description?: string;
    shortDescription?: string;
    props?: TProps;
    events?: TEvents;
    contextVars?: TContextValues;
    apis?: TApis;
    nonVisual?: boolean;
    childrenAsTemplate?: string;
    opaque?: boolean;
    themeVars?: Record<string, string>;
    themeVarDescriptions?: Record<string, string>;
    defaultThemeVars?: DefaultThemeVars;
    toneSpecificThemeVars?: Record<string, Record<string, string>>;
    limitThemeVarsToComponent?: boolean;
    allowArbitraryProps?: boolean;
    specializedFrom?: string;
    docFolder?: string;
    isHtmlTag?: boolean;
    parts?: Record<string, ComponentPartMetadata>;
    defaultPart?: string;
    excludeBehaviors?: string[];
    deprecationMessage?: string;
};

declare type ComponentPartMetadata = {
    description: string;
};

declare type ComponentPropertyMetadata = {
    readonly description: string;
    readonly valueType?: PropertyValueType;
    readonly availableValues?: readonly PropertyValueDescription[];
    defaultValue?: any;
    isValid?: IsValidFunction<any>;
    isInternal?: boolean;
    isRequired?: boolean;
    deprecationMessage?: string;
};

declare interface ComponentRendererContextBase<TMd extends ComponentMetadata = ComponentMetadata> {
    node: ComponentDef<TMd>;
    state: ContainerState;
    globalVars?: Record<string, any>;
    appContext?: AppContextObject;
    renderChild: RenderChildFn;
    layoutContext?: LayoutContext;
}

declare type ComponentRendererDef<T extends ComponentDef = any> = {
    type: string;
    renderer: ComponentRendererFn<T>;
    metadata?: ComponentMetadata;
};

declare type ComponentRendererFn<T extends ComponentDef> = (context: RendererContext<T>) => ReactNode;

declare interface CompoundComponentDef extends Scriptable {
    name: string;
    component: ComponentDef;
    api?: Record<string, any>;
    vars?: Record<string, any>;
    namespaces?: Record<string, string>;
    debug?: Record<string, any>;
    codeBehind?: string;
}

declare type CompoundComponentRendererInfo = {
    compoundComponentDef: CompoundComponentDef;
    metadata?: ComponentMetadata;
};

declare type CONDITIONAL_EXPRESSION = typeof T_CONDITIONAL_EXPRESSION;

declare interface ConditionalExpression extends ExpressionBase {
    type: CONDITIONAL_EXPRESSION;
    cond: Expression;
    thenE: Expression;
    elseE: Expression;
}

declare interface ConditionBase {
    type: BehaviorCondition["type"];
}

declare type CONST_STATEMENT = typeof T_CONST_STATEMENT;

declare interface ConstStatement extends ScripNodeBase {
    type: CONST_STATEMENT;
    decls: VarDeclaration[];
}

declare type ContainerState = Record<string | symbol, any>;

declare const ContentSeparator: ForwardRefExoticComponent<ContentSeparatorProps & RefAttributes<HTMLDivElement>>;

declare type ContentSeparatorProps = {
    thickness?: number | string;
    length?: number | string;
    orientation?: string;
    hasExplicitLength?: boolean;
    style?: CSSProperties;
    className?: string;
};

declare type CONTINUE_STATEMENT = typeof T_CONTINUE_STATEMENT;

declare interface ContinueStatement extends ScripNodeBase {
    type: CONTINUE_STATEMENT;
}

/**
 * Applications can contribute to the registry with their custom (third-party)
 * and application-specific components and others. This type holds the
 * definitions of these extra artifacts.
 */
declare type ContributesDefinition = {
    /**
     * Native xmlui components that come with the app.
     */
    components?: ComponentRendererDef[];
    /**
     * Application-specific compound components that come with the app.
     */
    compoundComponents?: CompoundComponentDef[];
    /**
     * Themes that come with the app.
     */
    themes?: ThemeDefinition[];
    /**
     * Custom behaviors that come with the app.
     */
    behaviors?: Behavior[];
};

/**
 * This helper function creates a component renderer definition from its arguments.
 * @param type The unique identifier of the component definition
 * @param renderer The function that renders the component definition into a React node
 * @param metadata Optional hints to help fix the rendering errors coming from invalid component property definitions
 * @returns The view renderer definition composed of the arguments
 */
declare function createComponentRenderer<TMd extends ComponentMetadata>(type: string, metadata: TMd, renderer: ComponentRendererFn<ComponentDef<any>>): ComponentRendererDef;

declare function createMetadata<TProps extends Record<string, ComponentPropertyMetadata>, TEvents extends Record<string, ComponentPropertyMetadata>, TContextVars extends Record<string, ComponentPropertyMetadata> = Record<string, any>, TApis extends Record<string, ComponentPropertyMetadata> = Record<string, any>>(metadata: ComponentMetadata<TProps, TEvents, TContextVars, TApis>): ComponentMetadata<TProps, TEvents, TContextVars, TApis>;

/**
 * This helper function creates a user defined component renderer definition from its arguments.
 * @param metadata The metadata of the user-defined component
 * @param componentMarkup The XMLUI markup that defines the user-defined component
 * @param codeBehind Optional code-behind script that contains variable and function definitions
 * used by the component
 * @returns The view renderer definition composed of the arguments
 */
declare function createUserDefinedComponentRenderer<TMd extends ComponentMetadata>(metadata: TMd, def: any, codeBehind?: any): CompoundComponentRendererInfo;

declare function d(description: string, availableValues?: readonly PropertyValueDescription[], valueType?: PropertyValueType, defaultValue?: any, isValid?: IsValidFunction<any>, isRequired?: boolean): ComponentPropertyMetadata;

declare function dAutoFocus(): ComponentPropertyMetadata;

declare function dClick(comp: string): ComponentEventMetadata;

declare function dCollapse(comp: string): ComponentPropertyMetadata;

declare function dComponent(description: string): ComponentPropertyMetadata;

declare function dDidChange(comp: string): ComponentEventMetadata;

declare function dDidClose(comp: string): ComponentPropertyMetadata;

declare function dDidOpen(comp: string): ComponentPropertyMetadata;

declare type DefaultThemeVars = Record<string | ThemeTone, string | Record<string, string>>;

declare type DefaultValueDescriptor = (string | ThemeIdDescriptor)[];

declare function dEnabled(isEnabled?: boolean): ComponentPropertyMetadata;

declare function dEndIcon(): ComponentPropertyMetadata;

declare function dEndText(): ComponentPropertyMetadata;

declare type DESTRUCTURE = typeof T_DESTRUCTURE;

declare interface Destructure extends DestructureBase {
    type: DESTRUCTURE;
    aDestr?: ArrayDestructure[];
    oDestr?: ObjectDestructure[];
}

declare interface DestructureBase extends ExpressionBase {
    id?: string;
    aDestr?: ArrayDestructure[];
    oDestr?: ObjectDestructure[];
}

declare function dExpand(comp: string): ComponentPropertyMetadata;

declare function dExpanded(comp: string): ComponentPropertyMetadata;

declare function dFocus(comp: string): ComponentPropertyMetadata;

declare function dGotFocus(comp: string): ComponentEventMetadata;

declare function dIndeterminate(defaultValue?: boolean): ComponentPropertyMetadata;

declare function dInit(comp: string): ComponentEventMetadata;

declare function dInitialValue(value?: any): ComponentPropertyMetadata;

declare function dInternal(description?: string): ComponentPropertyMetadata;

declare function dLabel(): ComponentPropertyMetadata;

declare function dLabelBreak(comp: string): ComponentPropertyMetadata;

declare function dLabelPosition(def?: string): ComponentPropertyMetadata;

declare function dLabelWidth(comp: string): ComponentPropertyMetadata;

declare function dLostFocus(comp: string): ComponentEventMetadata;

declare function dMaxLength(): ComponentPropertyMetadata;

declare function dMulti(): ComponentPropertyMetadata;

declare type DO_WHILE_STATEMENT = typeof T_DO_WHILE_STATEMENT;

declare function dOrientation(defaultValue: string, isRequired?: boolean): ComponentPropertyMetadata;

declare interface DoWhileStatement extends ScripNodeBase {
    type: DO_WHILE_STATEMENT;
    cond: Expression;
    body: Statement;
}

declare function dPlaceholder(): ComponentPropertyMetadata;

declare function dReadonly(readOnly?: boolean): ComponentPropertyMetadata;

declare function dRequired(): ComponentPropertyMetadata;

declare const DropdownMenu: ForwardRefExoticComponent<DropdownMenuProps & RefAttributes<HTMLButtonElement>>;

declare type DropdownMenuProps = {
    triggerTemplate?: ReactNode;
    children?: ReactNode;
    label?: string;
    registerComponentApi?: RegisterComponentApiFn;
    style?: CSSProperties;
    className?: string;
    alignment?: AlignmentOptions;
    onWillOpen?: () => Promise<boolean | undefined>;
    disabled?: boolean;
    triggerButtonVariant?: string;
    triggerButtonThemeColor?: string;
    triggerButtonIcon?: string;
    triggerButtonIconPosition?: IconPosition;
    compact?: boolean;
    modal?: boolean;
};

declare function dSetValueApi(): ComponentPropertyMetadata;

declare function dStartIcon(): ComponentPropertyMetadata;

declare function dStartText(): ComponentPropertyMetadata;

declare function dTriggerTemplate(comp: string): ComponentPropertyMetadata;

declare function dValidationStatus(value?: string): ComponentPropertyMetadata;

declare function dValue(): ComponentPropertyMetadata;

declare function dValueApi(): ComponentPropertyMetadata;

declare interface DynamicChildComponentDef extends ComponentDef {
    renderChild: RenderChildFn;
    childToRender: ComponentDef;
}

declare type EMPTY_STATEMENT = typeof T_EMPTY_STATEMENT;

declare interface EmptyStatement extends ScripNodeBase {
    type: EMPTY_STATEMENT;
}

declare type EntrypointCompilation = CompilationUnit & {
    /** The compiled markup of the main file */
    definition: ComponentDef;
};

declare enum ErrCodesParser {
    onlyOneElem = "U002",
    expTagOpen = "U003",
    expTagName = "U004",
    expCloseStart = "U005",
    expEndOrClose = "U006",
    tagNameMismatch = "U007",
    expEnd = "U008",
    expAttrName = "U009",
    expEq = "U010",
    expAttrValue = "U011",
    duplAttr = "U012",
    uppercaseAttr = "U013",
    expTagNameAfterNamespace = "U014",
    expCloseStartWithName = "U015",
    expAttrNameAfterNamespace = "U016",
    unexpectedCloseTag = "U017",
    expTagNameAfterCloseStart = "U019",
    expAttrNameBeforeEq = "U020",
    invalidChar = "W001",
    untermStr = "W002",
    untermComment = "W007",
    untermCData = "W008",
    untermScript = "W009"
}

declare const ErrCodesTransform: {
    readonly expressionExpected: "W001";
    readonly unexpectedToken: "W002";
    readonly identifierExpected: "W003";
    readonly closeBraceExpected: "W004";
    readonly closeBracketExpected: "W005";
    readonly closeParenExpected: "W006";
    readonly invalidPropName: "W007";
    readonly colonExpected: "W008";
    readonly equalExpected: "W009";
    readonly invalidArgList: "W010";
    readonly forLoopVarRequired: "W011";
    readonly openBraceExpected: "W012";
    readonly catchOrFinallyExpected: "W013";
    readonly openParenExpected: "W014";
    readonly caseOrDefaultExpected: "W015";
    readonly defaultCaseOnce: "W016";
    readonly invalidSequence: "W017";
    readonly invalidObjLiteral: "W018";
    readonly alreadyImported: "W019";
    readonly funcAlreadyDefined: "W020";
    readonly alreadyExported: "W021";
    readonly moduleNotFound: "W022";
    readonly exportNotFound: "W023";
    readonly functionExpected: "W024";
    readonly fromExpected: "W025";
    readonly stringLiteralExpected: "W026";
    readonly varInImportedModule: "W027";
    readonly invalidModuleStatement: "W028";
    readonly moduleOnlyExports: "W029";
    readonly nestedExport: "W030";
    readonly dollarIdentifier: "W031";
    readonly openBraceImportExpected: "W032";
    readonly identifierInImportExpected: "W033";
    readonly identifierAfterAsExpected: "W034";
    readonly commaOrCloseBraceExpected: "W035";
    readonly importFromExpected: "W036";
    readonly importPathExpected: "W037";
    readonly importNotAtTop: "W040";
    readonly importedFunctionNotFound: "W039";
    readonly circularImport: "W041";
    readonly circularImportDetailed: "W042";
    readonly reactiveVarInImportedModule: "W043";
    readonly constLetInImportedModule: "W044";
    readonly invalidStatementInImportedModule: "W045";
    readonly singleRootElem: "T001";
    readonly compDefNameUppercase: "T002";
    readonly compDefNameExp: "T003";
    readonly multipleScriptTags: "T004";
    readonly compDefNesedElem: "T005";
    readonly nestedCompDefs: "T006";
    readonly invalidAttrName: "T007";
    readonly eventNoOnPrefix: "T008";
    readonly invalidNodeName: "T009";
    readonly noTextChild: "T010";
    readonly onlyNameValueAttrs: "T011";
    readonly nameAttrRequired: "T012";
    readonly loaderIdRequired: "T013";
    readonly loaderCantHave: "T014";
    readonly usesValueOnly: "T015";
    readonly onlyFieldOrItemChild: "T016";
    readonly cannotMixFieldItem: "T017";
    readonly cantHaveNameAttr: "T018";
    readonly valueAttrRequired: "T019";
    readonly cannotMixCompNonComp: "T020";
    readonly invalidReusableCompAttr: "T021";
    readonly scriptNoAttrs: "T022";
    readonly cantPutReusableDefInSlot: "T024";
    readonly duplXmlns: "T025";
    readonly rootCompNoNamespace: "T026";
    readonly nsNotFound: "T027";
    readonly nsValueIncorrect: "T028";
    readonly nsSchemeIncorrect: "T029";
    readonly scriptParse: "T030";
    readonly globalNotAllowedInNested: "T031";
    readonly globalNotAllowedInComponent: "T032";
};

declare type ErrCodesTransform = (typeof ErrCodesTransform)[keyof typeof ErrCodesTransform];

/**
 * This React component serves as an error boundary; it catches any errors within
 * the nested components
 */
declare class ErrorBoundary extends default_2.Component<Props, State> {
    state: State;
    /**
     * This method implements the Error Boundaries for the React application.
     * It is invoked if errors occur during the rendering phase of any lifecycle
     * methods or children components.
     *
     * DO NOT DELETE this method! Though it is not referenced directly from the code,
     * it is a required part of the React component lifecycle.
     */
    static getDerivedStateFromError(error: Error): State;
    /**
     * Display any error in the console and trace it
     * @param error Error object
     * @param errorInfo Extra information about the error
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    /**
     * Whenever the `restoreOnChangeOf` property of this component instance
     * changes, we reset the state to "no error".
     * @param prevProps Previous property values
     * @param prevState Previous state
     * @param snapshot Optional snapshot (not used in this component)
     */
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void;
    /**
     * Display an error message if an error occurred during rendering.
     */
    render(): string | number | boolean | Iterable<default_2.ReactNode> | JSX_2.Element;
}

declare interface ErrorForDisplay extends GeneralDiag {
    contextStartLine: number;
    contextSource: string;
    errPosLine: number;
    errPosCol: number;
}

declare function errReportComponent(errors: ErrorForDisplay[], fileName: number | string, compoundCompName: string | undefined): any;

declare type Expression = UnaryExpression | BinaryExpression | SequenceExpression | ConditionalExpression | FunctionInvocationExpression | MemberAccessExpression | CalculatedMemberAccessExpression | Identifier | TemplateLiteralExpression | Literal | ArrayLiteral | ObjectLiteral | SpreadExpression | AssignmentExpression | NoArgExpression | ArrowExpression | PrefixOpExpression | PostfixOpExpression | ReactiveVarDeclaration | AwaitExpression | NewExpression | VarDeclaration | Destructure | ObjectDestructure | ArrayDestructure | SwitchCase;

declare type EXPRESSION_STATEMENT = typeof T_EXPRESSION_STATEMENT;

declare interface ExpressionBase extends ScripNodeBase {
    parenthesized?: number;
    source?: string;
}

declare interface ExpressionStatement extends ScripNodeBase {
    type: EXPRESSION_STATEMENT;
    expr: Expression;
}

declare interface Extension {
    namespace?: string;
    components?: ComponentExtension[];
    themes?: ThemeDefinition[];
    /** Optional global functions merged into app globalVars when the extension is registered. */
    functions?: Record<string, (...args: any[]) => any>;
}

declare type ExtensionRegisteredCallbackFn = (extension: Extension) => void;

declare type FontDef = {
    fontFamily: string;
    fontStyle?: string;
    fontWeight?: string;
    fontDisplay?: string;
    format?: string;
    src: string;
} | string;

declare type FOR_IN_STATEMENT = typeof T_FOR_IN_STATEMENT;

declare type FOR_OF_STATEMENT = typeof T_FOR_OF_STATEMENT;

declare type FOR_STATEMENT = typeof T_FOR_STATEMENT;

declare interface ForInStatement extends ScripNodeBase {
    type: FOR_IN_STATEMENT;
    varB: ForVarBinding;
    id: Identifier;
    expr: Expression;
    body: Statement;
}

declare interface ForOfStatement extends ScripNodeBase {
    type: FOR_OF_STATEMENT;
    varB: ForVarBinding;
    id: Identifier;
    expr: Expression;
    body: Statement;
}

declare interface ForStatement extends ScripNodeBase {
    type: FOR_STATEMENT;
    init?: ExpressionStatement | LetStatement;
    cond?: Expression;
    upd?: Expression;
    body: Statement;
}

declare type ForVarBinding = "let" | "const" | "none";

declare type FUNCTION_DECLARATION = typeof T_FUNCTION_DECLARATION;

declare type FUNCTION_INVOCATION_EXPRESSION = typeof T_FUNCTION_INVOCATION_EXPRESSION;

declare interface FunctionDeclaration extends ScripNodeBase {
    type: FUNCTION_DECLARATION | ASYNC_FUNCTION_DECLARATION;
    id: Identifier;
    args: Expression[];
    stmt: BlockStatement;
    async?: boolean;
}

declare interface FunctionInvocationExpression extends ExpressionBase {
    type: FUNCTION_INVOCATION_EXPRESSION;
    obj: Expression;
    arguments: Expression[];
}

declare interface GeneralDiag {
    readonly code: ErrCodesParser | ErrCodesTransform;
    readonly message: string;
    readonly pos: number;
    readonly end: number;
    readonly contextPos: number;
    readonly contextEnd: number;
}

declare type GenericToken<T> = {
    text: string;
    type: T;
    startPosition: number;
    endPosition: number;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
};

declare function getColor(varName: string, format?: "hex" | "rgb" | "hsl"): string;

declare type GlobalProps = Record<string, any>;

declare interface hasApiCondition extends ConditionBase {
    type: "hasApi";
    apiName: string;
}

declare interface hasContextVarCondition extends ConditionBase {
    type: "hasContextVar";
    contextVarName: string;
}

declare interface hasEventCondition extends ConditionBase {
    type: "hasEvent";
    eventName: string;
}

declare interface hasNoApiCondition extends ConditionBase {
    type: "hasNoApi";
    apiName: string;
}

declare interface hasNoContextVarCondition extends ConditionBase {
    type: "hasNoContextVar";
    contextVarName: string;
}

declare interface hasNoEventCondition extends ConditionBase {
    type: "hasNoEvent";
    eventName: string;
}

declare interface hasNoPropCondition extends ConditionBase {
    type: "hasNoProp";
    propName: string;
}

declare interface hasPropCondition extends ConditionBase {
    type: "hasProp";
    propName: string;
}

declare interface IApiInterceptor<TRequestInit = any> {
    hasMockForRequest(url: string, options: TRequestInit): boolean;
    executeMockedFetch(url: string, options: TRequestInit): Promise<any>;
}

declare interface IApiInterceptorContext {
    isMocked: (url: string) => boolean;
    initialized: boolean;
    forceInitialize: () => void;
    interceptorWorker: SetupWorker | null;
    apiInstance: IApiInterceptor | null;
}

declare interface IAppLayoutContext {
    layout: AppLayoutType;
    navPanelVisible: boolean;
    navPanelCollapsed: boolean;
    setNavPanelCollapsed: (collapsed: boolean) => void;
    toggleNavPanelCollapsed: () => void;
    drawerVisible: boolean;
    showDrawer: () => void;
    hideDrawer: () => void;
    toggleDrawer: () => void;
    hasRegisteredNavPanel: boolean;
    hasRegisteredHeader: boolean;
    navPanelDef?: ComponentDef;
    logoContentDef?: ComponentDef;
    logo?: string;
    logoDark?: string;
    logoLight?: string;
    registerSubNavPanelSlot?: (slot: HTMLElement) => void;
    subNavPanelSlot?: HTMLElement;
    scrollWholePage?: boolean;
    isFullVerticalWidth?: boolean;
    isNested?: boolean;
    setScrollRestorationEnabled?: (enabled: boolean) => void;
}

declare const Icon: default_2.ForwardRefExoticComponent<IconBaseProps & default_2.RefAttributes<HTMLElement>>;

declare interface IconBaseProps extends default_2.SVGAttributes<SVGElement> {
    children?: default_2.ReactNode;
    color?: string;
    title?: string;
    size?: string;
    isInline?: boolean;
    fallback?: string;
    style?: CSSProperties;
    className?: string;
    tabIndex?: number;
    onKeyDown?: default_2.KeyboardEventHandler<any>;
}

declare type IconPosition = (typeof iconPositionValues)[number];

declare const iconPositionValues: readonly ["start", "end"];

declare type IDENTIFIER = typeof T_IDENTIFIER;

declare interface Identifier extends ExpressionBase {
    type: IDENTIFIER;
    name: string;
    isGlobal?: boolean;
}

declare type IF_STATEMENT = typeof T_IF_STATEMENT;

declare interface IfStatement extends ScripNodeBase {
    type: IF_STATEMENT;
    cond: Expression;
    thenB: Statement;
    elseB?: Statement;
}

declare type IMPORT_DECLARATION = typeof T_IMPORT_DECLARATION;

declare type IMPORT_SPECIFIER = typeof T_IMPORT_SPECIFIER;

declare interface ImportDeclaration extends ScripNodeBase {
    type: IMPORT_DECLARATION;
    specifiers: ImportSpecifier[];
    source: Literal;
}

declare interface ImportSpecifier extends ExpressionBase {
    type: IMPORT_SPECIFIER;
    imported: Identifier;
    local?: Identifier;
}

declare interface InteractionDetail {
    [key: string]: any;
}

declare type InterceptorOperationDef = {
    method: "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
    url: string | Array<string>;
    handler: string;
    requestShape?: any;
    responseShape?: any;
    pathParamTypes?: Record<string, string>;
    queryParamTypes?: Record<string, string>;
    successStatusCode?: number;
};

declare interface isNotTypeCondition extends ConditionBase {
    type: "isNotType";
    nodeType: string;
}

declare interface isTypeCondition extends ConditionBase {
    type: "isType";
    nodeType: string;
}

declare type IsValidFunction<T> = (propKey: string, propValue: T) => string | string[] | undefined | null;

declare type LayoutContext<T extends ComponentDef = ComponentDef> = {
    type?: string;
    wrapChild?: (context: RendererContext<T>, renderedChild: ReactNode, metadata?: ComponentMetadata) => ReactNode;
    [key: string]: any;
};

declare type LET_STATEMENT = typeof T_LET_STATEMENT;

declare interface LetStatement extends ScripNodeBase {
    type: LET_STATEMENT;
    decls: VarDeclaration[];
}

declare const LinkNative: ForwardRefExoticComponent<    {
to: string | {
pathname: string;
queryParams?: Record<string, any>;
};
children: ReactNode;
icon?: string;
active?: boolean;
disabled?: boolean;
horizontalAlignment?: string;
verticalAlignment?: string;
onClick?: () => void;
style?: CSSProperties;
className?: string;
} & Partial<Pick<HTMLAnchorElement, "type" | "target" | "rel" | "referrerPolicy" | "download" | "ping" | "hreflang">> & RefAttributes<HTMLDivElement>>;

declare type LITERAL = typeof T_LITERAL;

declare interface Literal extends ExpressionBase {
    type: LITERAL;
    value: any;
}

declare type LogContextType = {
    logs: LogEntry[];
    addLog: (args: any[]) => void;
};

declare type LogEntry = {
    timestamp: Date;
    args: any[];
};

declare type LoggedInUserDto = {
    id: number;
    email: string;
    name: string;
    imageRelativeUrl: string;
    permissions: Record<string, string>;
};

declare type LogInteractionFn = (interaction: string, detail?: InteractionDetail) => void;

declare const Logo: ForwardRefExoticComponent<LogoProps & RefAttributes<HTMLImageElement>>;

declare type LogoProps = {
    alt?: string;
    style?: CSSProperties;
    className?: string;
    inline?: boolean;
};

declare type LookupActionOptions = {
    signError?: boolean;
    eventName?: string;
    ephemeral?: boolean;
    defaultHandler?: string;
    context?: any;
    componentType?: string;
    componentLabel?: string;
    componentId?: string;
    sourceFileId?: string | number;
    sourceRange?: {
        start: number;
        end: number;
    };
};

declare type LookupAsyncFn = (action: string | undefined, actionOptions?: LookupActionOptions) => AsyncFunction | undefined;

declare type LookupAsyncFnInner = (action: string | undefined, uid: symbol, actionOptions?: LookupActionOptions) => AsyncFunction | undefined;

declare type LookupEventHandlerFn<TMd extends ComponentMetadata = ComponentMetadata> = (eventName: keyof NonNullable<TMd["events"]>, actionOptions?: LookupActionOptions) => AsyncFunction | undefined;

declare type LookupSyncFn = (action: string | undefined) => SyncFunction | undefined;

declare const MediaBreakpointKeys: readonly ["xs", "sm", "md", "lg", "xl", "xxl"];

declare type MediaBreakpointType = (typeof MediaBreakpointKeys)[number];

declare type MediaSize = {
    phone: boolean;
    landscapePhone: boolean;
    tablet: boolean;
    desktop: boolean;
    largeDesktop: boolean;
    xlDesktop: boolean;
    smallScreen: boolean;
    largeScreen: boolean;
    size: MediaBreakpointType;
    sizeIndex: number;
};

declare type MEMBER_ACCESS_EXPRESSION = typeof T_MEMBER_ACCESS_EXPRESSION;

declare interface MemberAccessExpression extends ExpressionBase {
    type: MEMBER_ACCESS_EXPRESSION;
    obj: Expression;
    member: string;
    opt?: boolean;
}

declare const MemoizedItem: MemoExoticComponent<({ node, renderChild, layoutContext, contextVars, }: MemoizedItemProps) => JSX_2.Element>;

declare type MemoizedItemProps = {
    node: ComponentDef | Array<ComponentDef>;
    renderChild: RenderChildFn;
    layoutContext?: LayoutContext;
    contextVars?: Record<string, any>;
};

declare const MenuItem: ForwardRefExoticComponent<MenuItemProps & RefAttributes<unknown>>;

declare type MenuItemProps = {
    icon?: ReactNode;
    iconPosition?: IconPosition;
    onClick?: (event: any) => void;
    children?: ReactNode;
    label?: string;
    style?: CSSProperties;
    className?: string;
    to?: string;
    active?: boolean;
    enabled?: boolean;
    compact?: boolean;
};

declare type Message = ValueOrFunction<Renderable, Toast>;

/**
 * Represents a module error
 */
declare type ModuleErrors = Record<string, ScriptParserErrorMessage[]>;

declare function NavPanelCollapseButton({ icon, iconCollapsed, "aria-label": ariaLabel, "aria-labelCollapsed": ariaLabelCollapsed, }: {
    icon?: string;
    iconCollapsed?: string;
    "aria-label"?: string;
    "aria-labelCollapsed"?: string;
}): JSX_2.Element;

declare function NestedApp({ api, app, components, config, activeTheme, activeTone, height, style, refreshVersion, withSplashScreen, className, }: NestedAppProps): JSX_2.Element;

declare type NestedAppProps = {
    api?: any;
    app: string;
    components?: any[];
    config?: any;
    activeTone?: ThemeTone;
    activeTheme?: string;
    height?: string | number;
    style?: CSSProperties;
    refreshVersion?: number;
    withSplashScreen?: boolean;
    className?: string;
};

declare type NEW_EXPRESSION = typeof T_NEW_EXPRESSION;

declare interface NewExpression extends ExpressionBase {
    type: NEW_EXPRESSION;
    callee: Expression;
    arguments: Expression[];
}

declare type NO_ARG_EXPRESSION = typeof T_NO_ARG_EXPRESSION;

declare interface NoArgExpression extends ExpressionBase {
    type: NO_ARG_EXPRESSION;
}

declare interface NonVisualCondition extends ConditionBase {
    type: "nonVisual";
}

declare interface NotCondition extends ConditionBase {
    type: "not";
    condition: BehaviorCondition;
}

declare type OBJECT_DESTRUCTURE = typeof T_OBJECT_DESTRUCTURE;

declare type OBJECT_LITERAL = typeof T_OBJECT_LITERAL;

declare interface ObjectDestructure extends DestructureBase {
    type: OBJECT_DESTRUCTURE;
    id: string;
    alias?: string;
}

declare interface ObjectLiteral extends ExpressionBase {
    type: OBJECT_LITERAL;
    props: (SpreadExpression | [Expression, Expression])[];
}

declare interface OrCondition extends ConditionBase {
    type: "or";
    conditions: BehaviorCondition[];
}

declare type OrientationOptions = (typeof orientationOptionValues)[number];

declare const orientationOptionValues: readonly ["horizontal", "vertical"];

declare type OverflowMode = (typeof OverflowModeKeys)[number];

declare const OverflowModeKeys: readonly ["none", "ellipsis", "scroll", "flow"];

declare interface ParentRenderContext {
    renderChild: RenderChildFn;
    children?: ComponentDef[];
    props?: Record<string, any>;
}

declare type ParserResult = {
    component: null | ComponentDef | CompoundComponentDef;
    errors: ErrorForDisplay[];
    erroneousCompoundComponentName?: string;
};

/**
 * This function extracts CSS variables from the specified SCSS input. It uses a hack to convert the CSS input to JSON
 * and then calls a JSON parser to create the desired object.
 * @param scssStr The scss input
 */
declare function parseScssVar(scssStr: any): any;

declare type POSTFIX_OP_EXPRESSION = typeof T_POSTFIX_OP_EXPRESSION;

declare interface PostfixOpExpression extends ExpressionBase {
    type: POSTFIX_OP_EXPRESSION;
    op: PrefixOpSymbol;
    expr: Expression;
}

declare type PREFIX_OP_EXPRESSION = typeof T_PREFIX_OP_EXPRESSION;

declare interface PrefixOpExpression extends ExpressionBase {
    type: PREFIX_OP_EXPRESSION;
    op: PrefixOpSymbol;
    expr: Expression;
}

declare type PrefixOpSymbol = "++" | "--";

/** Contains the compilation result of a project */
declare type ProjectCompilation = {
    /** The compiled Main.xmlui file (with its optional code behind) */
    entrypoint: EntrypointCompilation;
    /** The compiled component files (with their optional code behind) */
    components: ComponentCompilation[];
    /** The compiled theme files */
    themes: Record<string, ThemeDefinition>;
};

declare interface PropContainsCondition extends ConditionBase {
    type: "propContains";
    propName: string;
}

declare interface PropEqualsCondition extends ConditionBase {
    type: "propEquals";
    propName: string;
}

declare type PropertyValueDescription<T = string | number> = T | {
    value: T;
    description: string;
};

declare type PropertyValueType = "boolean" | "string" | "number" | "any" | "ComponentDef";

declare interface PropNotEqualsCondition extends ConditionBase {
    type: "propNotEquals";
    propName: string;
}

declare interface Props {
    children: ReactNode;
    node?: ComponentLike;
    location?: string;
}

declare type Props_2 = {
    children: ReactNode;
    orientation?: string;
    uid?: string;
    horizontalAlignment?: string;
    verticalAlignment?: string;
    style?: CSSProperties;
    className?: string;
    reverse?: boolean;
    hoverContainer?: boolean;
    visibleOnHover?: boolean;
    scrollStyle?: ScrollStyle;
    showScrollerFade?: boolean;
    onClick?: any;
    onContextMenu?: any;
    onMount?: any;
    desktopOnly?: boolean;
    registerComponentApi?: (api: any) => void;
};

declare type Props_3 = {
    id?: string;
    activeTab?: number;
    orientation?: "horizontal" | "vertical";
    tabAlignment?: "start" | "end" | "center" | "stretch";
    accordionView?: boolean;
    headerRenderer?: (item: {
        id?: string;
        index: number;
        label: string;
        isActive: boolean;
    }) => ReactNode;
    style?: CSSProperties;
    children?: ReactNode;
    registerComponentApi?: RegisterComponentApiFn;
    className?: string;
    distributeEvenly?: boolean;
    onDidChange?: (index: number, id: string, label: string) => void;
    onContextMenu?: any;
};

declare type Props_4 = {
    interceptor?: ApiInterceptorDefinition;
    children: ReactNode;
    parentInterceptorContext?: IApiInterceptorContext;
    waitForApiInterceptor?: boolean;
    useHashBasedRouting?: boolean;
};

/**
 * TextBox component that supports text input with various configurations.
 * Features:
 * - Standard text, password, and search input types
 * - Input validation states
 * - Start/end adornments (icons and text)
 * - Password visibility toggle option
 */
declare type Props_5 = {
    id?: string;
    type?: "text" | "password" | "search";
    value?: string;
    updateState?: UpdateStateFn;
    initialValue?: string;
    style?: CSSProperties;
    className?: string;
    maxLength?: number;
    enabled?: boolean;
    placeholder?: string;
    validationStatus?: ValidationStatus;
    onDidChange?: (newValue: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (event: default_2.KeyboardEvent<HTMLInputElement>) => void;
    registerComponentApi?: RegisterComponentApiFn;
    startText?: string;
    startIcon?: string;
    endText?: string;
    endIcon?: string;
    gap?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    tabIndex?: number;
    required?: boolean;
    /**
     * When true and type is "password", displays a toggle icon to show/hide password text
     * Default: false
     */
    showPasswordToggle?: boolean;
    /**
     * The icon to show when the password is visible
     * Default: "eye"
     */
    passwordVisibleIcon?: string;
    /**
     * The icon to show when the password is hidden
     * Default: "eye-off"
     */
    passwordHiddenIcon?: string;
    verboseValidationFeedback?: boolean;
    validationIconSuccess?: string;
    validationIconError?: string;
    invalidMessages?: string[];
};

declare type Props_6 = {
    children?: ReactNode;
    style?: CSSProperties;
};

declare type Props_7 = {
    id?: string;
    isRoot?: boolean;
    applyIf?: boolean;
    disableInlineStyle?: boolean;
    layoutContext?: LayoutContext;
    renderChild?: RenderChildFn;
    node?: ComponentDef;
    tone?: ThemeTone;
    toastDuration?: number;
    themeVars?: Record<string, string>;
    children?: ReactNode;
};

/**
 * PubSub service interface for managing topic subscriptions and publications.
 */
declare interface PubSubService {
    /**
     * Publishes a topic with optional data to all subscribers.
     * @param topic The topic to publish (string or number)
     * @param data Optional data payload to send to subscribers
     */
    publishTopic: (topic: string | number, data?: any) => void;
    /**
     * Subscribes a callback to one or more topics.
     * @param topics Single topic or array of topics to subscribe to
     * @param callback Function to call when any subscribed topic is published
     */
    subscribe: (topics: string | number | (string | number)[], callback: TopicCallback) => void;
    /**
     * Unsubscribes a callback from all topics it was subscribed to.
     * @param callback The callback to unsubscribe
     */
    unsubscribe: (callback: TopicCallback) => void;
}

declare type REACTIVE_VAR_DECLARATION = typeof T_REACTIVE_VAR_DECLARATION;

declare interface ReactiveVarDeclaration extends ExpressionBase {
    type: REACTIVE_VAR_DECLARATION;
    id: Identifier;
    expr: Expression;
}

declare type RegisterComponentApiFn = (componentApi: ComponentApi) => void;

declare type RenderChildFn<L extends ComponentDef = ComponentDef> = (children?: ComponentDef | ComponentDef[] | DynamicChildComponentDef | DynamicChildComponentDef[] | string, layoutContext?: LayoutContext<L>, parentRenderContext?: ParentRenderContext, uidInfoRef?: RefObject<Record<string, any>>, ref?: ForwardedRef<any>, rest?: Record<string, any>) => ReactNode | ReactNode[];

declare interface RendererContext<TMd extends ComponentMetadata = ComponentMetadata> extends ComponentRendererContextBase<TMd> {
    uid: symbol;
    updateState: UpdateStateFn;
    contextVars: Record<string, any>;
    extractValue: ValueExtractor;
    extractResourceUrl: (url?: string) => string | undefined;
    lookupEventHandler: LookupEventHandlerFn<TMd>;
    registerComponentApi: RegisterComponentApiFn;
    lookupAction: LookupAsyncFn;
    lookupSyncCallback: LookupSyncFn;
    className?: string;
    logInteraction: LogInteractionFn;
}

declare type RETURN_STATEMENT = typeof T_RETURN_STATEMENT;

declare interface ReturnStatement extends ScripNodeBase {
    type: RETURN_STATEMENT;
    expr?: Expression;
}

declare type RootComponentProps = {
    node: ComponentDef;
    children?: ReactNode;
    functions?: Record<string, any>;
    vars?: Record<string, any>;
};

declare type RuntimeProps = {
    default?: any;
    component?: ComponentDef | CompoundComponentDef;
    file?: string;
    src?: string;
};

declare type SchemaDescriptor = {
    tables: Array<TableDescriptor>;
    relationships?: any;
    dtos?: any;
};

declare interface ScripNodeBase {
    type: ScriptNode["type"];
    nodeId: number;
    startToken?: ScriptingToken;
    endToken?: ScriptingToken;
}

declare interface Scriptable {
    script?: string;
    scriptCollected?: CollectedDeclarations;
    scriptError?: any;
}

declare type ScriptingToken = GenericToken<TokenType>;

declare type ScriptNode = Statement | Expression;

declare interface ScriptParserErrorMessage {
    code: ScriptParsingErrorCodes;
    text: string;
    position?: number;
    line?: number;
    column?: number;
}

declare type ScriptParsingErrorCodes = "W001" | "W002" | "W003" | "W004" | "W005" | "W006" | "W007" | "W008" | "W009" | "W010" | "W011" | "W012" | "W013" | "W014" | "W015" | "W016" | "W017" | "W018" | "W019" | "W020" | "W021" | "W022" | "W023" | "W024" | "W025" | "W026" | "W027" | "W028" | "W029" | "W030" | "W031" | "W032" | "W033" | "W034" | "W035" | "W036" | "W037" | "W040" | "W038" | "W039" | "W041" | "W042" | "W043" | "W044" | "W045";

declare type ScrollStyle = "normal" | "overlay" | "whenMouseOver" | "whenScrolling";

declare type SearchEntry = {
    path: string;
    title: string;
    content: string;
};

declare type SEQUENCE_EXPRESSION = typeof T_SEQUENCE_EXPRESSION;

declare interface SequenceExpression extends ExpressionBase {
    type: SEQUENCE_EXPRESSION;
    exprs: Expression[];
    loose?: boolean;
}

declare type SizeType = (typeof sizeValues)[number];

declare const sizeValues: readonly ["xs", "sm", "md", "lg", "xl"];

declare const Spinner: ForwardRefExoticComponent<SpinnerProps & RefAttributes<HTMLDivElement>>;

declare type SpinnerProps = {
    delay?: number;
    fullScreen?: boolean;
    style?: CSSProperties;
    className?: string;
};

declare const Splitter: ({ initialPrimarySize, minPrimarySize, maxPrimarySize, orientation, children, style, className, swapped, floating, splitterTemplate, resize, visibleChildCount, ...rest }: SplitterProps) => JSX_2.Element;

declare type SplitterProps = {
    children: default_2.ReactNode[] | default_2.ReactNode;
    style?: default_2.CSSProperties;
    className?: string;
    splitterTemplate?: default_2.ReactNode;
    orientation?: OrientationOptions;
    floating?: boolean;
    resize?: (sizes: [number, number]) => void;
    swapped?: boolean;
    initialPrimarySize?: string;
    minPrimarySize?: string;
    maxPrimarySize?: string;
    visibleChildCount?: number;
};

declare type SPREAD_EXPRESSION = typeof T_SPREAD_EXPRESSION;

declare interface SpreadExpression extends ExpressionBase {
    type: SPREAD_EXPRESSION;
    expr: Expression;
}

declare const Stack: ForwardRefExoticComponent<Props_2 & RefAttributes<any>>;

/**
 * This React component represents a standalone app that implements a web
 * application with xmlui components. A StandaloneApp instance uses a
 * AppRoot wrapped into an ApiInterceptor.
 *
 * AppRoot is responsible for rendering the app (using an internal
 * representation); ApiInterceptor can emulate some backend functionality
 * running in the browser.
 */
declare function StandaloneApp({ appDef, appGlobals: globals, decorateComponentsWithTestId, debugEnabled, runtime, extensionManager, waitForApiInterceptor, children, }: StandaloneAppProps): JSX_2.Element;

declare type StandaloneAppDescription = {
    name?: string;
    version?: string;
    entryPoint?: ComponentLike;
    components?: CompoundComponentDef[];
    themes?: ThemeDefinition[];
    defaultTheme?: string;
    defaultTone?: string;
    resources?: Record<string, string>;
    resourceMap?: Record<string, string>;
    appGlobals?: Record<string, any>;
    apiInterceptor?: ApiInterceptorDefinition;
    sources?: Record<string, string>;
    icons?: Record<string, string>;
};

declare type StandaloneAppProps = {
    appDef?: StandaloneAppDescription;
    appGlobals?: Record<string, any>;
    decorateComponentsWithTestId?: boolean;
    debugEnabled?: boolean;
    runtime?: RuntimeProps;
    extensionManager?: StandaloneExtensionManager;
    waitForApiInterceptor?: boolean;
    children?: ReactNode;
};

declare function StandaloneComponent({ node, children, functions, vars }: RootComponentProps): ReactNode;

declare const standaloneExports: {
    standalone: StandaloneExtensionManager;
    StandaloneApp: typeof xmluiExports.StandaloneApp;
    StandaloneExtensionManager: typeof StandaloneExtensionManager;
    createComponentRenderer: typeof xmluiExports.createComponentRenderer;
    createUserDefinedComponentRenderer: typeof xmluiExports.createUserDefinedComponentRenderer;
    createMetadata: typeof xmluiExports.createMetadata;
    d: typeof xmluiExports.d;
    dComponent: typeof xmluiExports.dComponent;
    dAutoFocus: typeof xmluiExports.dAutoFocus;
    dClick: typeof xmluiExports.dClick;
    dCollapse: typeof xmluiExports.dCollapse;
    dDidChange: typeof xmluiExports.dDidChange;
    dDidClose: typeof xmluiExports.dDidClose;
    dDidOpen: typeof xmluiExports.dDidOpen;
    dEnabled: typeof xmluiExports.dEnabled;
    dFocus: typeof xmluiExports.dFocus;
    dEndIcon: typeof xmluiExports.dEndIcon;
    dEndText: typeof xmluiExports.dEndText;
    dExpanded: typeof xmluiExports.dExpanded;
    dExpand: typeof xmluiExports.dExpand;
    dGotFocus: typeof xmluiExports.dGotFocus;
    dIndeterminate: typeof xmluiExports.dIndeterminate;
    dInit: typeof xmluiExports.dInit;
    dInitialValue: typeof xmluiExports.dInitialValue;
    dInternal: typeof xmluiExports.dInternal;
    dLabel: typeof xmluiExports.dLabel;
    dLabelBreak: typeof xmluiExports.dLabelBreak;
    dLabelPosition: typeof xmluiExports.dLabelPosition;
    dLabelWidth: typeof xmluiExports.dLabelWidth;
    dLostFocus: typeof xmluiExports.dLostFocus;
    dMaxLength: typeof xmluiExports.dMaxLength;
    dMulti: typeof xmluiExports.dMulti;
    dOrientation: typeof xmluiExports.dOrientation;
    dPlaceholder: typeof xmluiExports.dPlaceholder;
    dReadonly: typeof xmluiExports.dReadonly;
    dRequired: typeof xmluiExports.dRequired;
    dStartIcon: typeof xmluiExports.dStartIcon;
    dStartText: typeof xmluiExports.dStartText;
    dSetValueApi: typeof xmluiExports.dSetValueApi;
    dTriggerTemplate: typeof xmluiExports.dTriggerTemplate;
    dValidationStatus: typeof xmluiExports.dValidationStatus;
    dValue: typeof xmluiExports.dValue;
    dValueApi: typeof xmluiExports.dValueApi;
    parseScssVar: typeof xmluiExports.parseScssVar;
    startApp: typeof startApp;
    useTheme: typeof xmluiExports.useTheme;
    AppRoot: typeof xmluiExports.AppRoot;
    ErrorBoundary: typeof xmluiExports.ErrorBoundary;
    Icon: default_2.ForwardRefExoticComponent<IconBaseProps_2 & default_2.RefAttributes<HTMLElement>>;
    Stack: default_2.ForwardRefExoticComponent<{
        children: default_2.ReactNode;
        orientation?: string;
        uid?: string;
        horizontalAlignment?: string;
        verticalAlignment?: string;
        style?: default_2.CSSProperties;
        className?: string;
        reverse?: boolean;
        hoverContainer?: boolean;
        visibleOnHover?: boolean;
        scrollStyle?: ScrollStyle_2;
        showScrollerFade?: boolean;
        onClick?: any;
        onContextMenu?: any;
        onMount?: any;
        desktopOnly?: boolean;
        registerComponentApi?: (api: any) => void;
    } & default_2.RefAttributes<any>>;
    Button: default_2.ForwardRefExoticComponent<{
        id?: string;
        type?: ButtonType_2;
        variant?: ButtonVariant_2;
        themeColor?: ButtonThemeColor_2;
        size?: SizeType_2;
        disabled?: boolean;
        children?: default_2.ReactNode | default_2.ReactNode[];
        icon?: default_2.ReactNode;
        iconPosition?: IconPosition_2;
        contentPosition?: AlignmentOptions_2;
        orientation?: OrientationOptions_2;
        formId?: string;
        style?: default_2.CSSProperties;
        gap?: string | number;
        autoFocus?: boolean;
        contextualLabel?: string;
    } & Pick<default_2.HTMLAttributes<HTMLButtonElement>, "className" | "aria-disabled" | "aria-label" | "aria-controls" | "aria-expanded" | "tabIndex" | "role" | "onFocus" | "onBlur" | "onClick" | "onContextMenu" | "onMouseEnter" | "onMouseLeave"> & default_2.RefAttributes<HTMLButtonElement>>;
    Splitter: ({ initialPrimarySize, minPrimarySize, maxPrimarySize, orientation, children, style, className, swapped, floating, splitterTemplate, resize, visibleChildCount, ...rest }: {
        children: default_2.ReactNode[] | default_2.ReactNode;
        style?: default_2.CSSProperties;
        className?: string;
        splitterTemplate?: default_2.ReactNode;
        orientation?: OrientationOptions_2;
        floating?: boolean;
        resize?: (sizes: [number, number]) => void;
        swapped?: boolean;
        initialPrimarySize?: string;
        minPrimarySize?: string;
        maxPrimarySize?: string;
        visibleChildCount?: number;
    }) => default_3.JSX.Element;
    getColor: typeof xmluiExports.getColor;
    TabItem: default_2.ForwardRefExoticComponent<Tab_2 & default_2.RefAttributes<HTMLDivElement>>;
    Tabs: default_2.ForwardRefExoticComponent<{
        id?: string;
        activeTab?: number;
        orientation?: "horizontal" | "vertical";
        tabAlignment?: "start" | "end" | "center" | "stretch";
        accordionView?: boolean;
        headerRenderer?: (item: {
            id?: string;
            index: number;
            label: string;
            isActive: boolean;
        }) => default_2.ReactNode;
        style?: default_2.CSSProperties;
        children?: default_2.ReactNode;
        registerComponentApi?: xmluiExports.RegisterComponentApiFn;
        className?: string;
        distributeEvenly?: boolean;
        onDidChange?: (index: number, id: string, label: string) => void;
        onContextMenu?: any;
    } & default_2.RefAttributes<HTMLDivElement>>;
    useColors: typeof xmluiExports.useColors;
    toCssVar: typeof xmluiExports.toCssVar;
    useDevTools: typeof xmluiExports.useDevTools;
    useLogger: () => {
        logs: {
            timestamp: Date;
            args: any[];
        }[];
        addLog: (args: any[]) => void;
    };
    errReportComponent: typeof xmluiExports.errReportComponent;
    xmlUiMarkupToComponent: typeof xmluiExports.xmlUiMarkupToComponent;
    ApiInterceptorProvider: typeof xmluiExports.ApiInterceptorProvider;
    Spinner: default_2.ForwardRefExoticComponent<{
        delay?: number;
        fullScreen?: boolean;
        style?: default_2.CSSProperties;
        className?: string;
    } & default_2.RefAttributes<HTMLDivElement>>;
    useThemes: typeof xmluiExports.useThemes;
    builtInThemes: xmluiExports.ThemeDefinition[];
    XmlUiHelper: typeof xmluiExports.XmlUiHelper;
    Text: default_2.ForwardRefExoticComponent<Omit<{
        [variantSpecificProps: string]: any;
        uid?: string;
        children?: default_2.ReactNode;
        variant?: TextVariant_2;
        maxLines?: number;
        preserveLinebreaks?: boolean;
        ellipses?: boolean;
        overflowMode?: OverflowMode_2;
        breakMode?: BreakMode_2;
        style?: default_2.CSSProperties;
        className?: string;
        onContextMenu?: any;
        registerComponentApi?: xmluiExports.RegisterComponentApiFn;
    }, "ref"> & default_2.RefAttributes<unknown>>;
    TextBox: default_2.ForwardRefExoticComponent<{
        id?: string;
        type?: "text" | "password" | "search";
        value?: string;
        updateState?: UpdateStateFn_2;
        initialValue?: string;
        style?: default_2.CSSProperties;
        className?: string;
        maxLength?: number;
        enabled?: boolean;
        placeholder?: string;
        validationStatus?: ValidationStatus_2;
        onDidChange?: (newValue: string) => void;
        onFocus?: () => void;
        onBlur?: () => void;
        onKeyDown?: (event: default_2.KeyboardEvent<HTMLInputElement>) => void;
        registerComponentApi?: xmluiExports.RegisterComponentApiFn;
        startText?: string;
        startIcon?: string;
        endText?: string;
        endIcon?: string;
        gap?: string;
        autoFocus?: boolean;
        readOnly?: boolean;
        tabIndex?: number;
        required?: boolean;
        showPasswordToggle?: boolean;
        passwordVisibleIcon?: string;
        passwordHiddenIcon?: string;
        verboseValidationFeedback?: boolean;
        validationIconSuccess?: string;
        validationIconError?: string;
        invalidMessages?: string[];
    } & default_2.RefAttributes<HTMLDivElement>>;
    NestedApp: typeof xmluiExports.NestedApp;
    VisuallyHidden: ({ children, ...props }: {
        children: default_2.ReactNode;
    }) => default_3.JSX.Element;
    LinkNative: default_2.ForwardRefExoticComponent<{
        to: string | {
            pathname: string;
            queryParams?: Record<string, any>;
        };
        children: default_2.ReactNode;
        icon?: string;
        active?: boolean;
        disabled?: boolean;
        horizontalAlignment?: string;
        verticalAlignment?: string;
        onClick?: () => void;
        style?: default_2.CSSProperties;
        className?: string;
    } & Partial<Pick<HTMLAnchorElement, "type" | "target" | "rel" | "referrerPolicy" | "download" | "ping" | "hreflang">> & default_2.RefAttributes<HTMLDivElement>>;
    ToneChangerButton: typeof xmluiExports.ToneChangerButton;
    NavPanelCollapseButton: typeof xmluiExports.NavPanelCollapseButton;
    Logo: default_2.ForwardRefExoticComponent<{
        alt?: string;
        style?: default_2.CSSProperties;
        className?: string;
        inline?: boolean;
    } & default_2.RefAttributes<HTMLImageElement>>;
    Breakout: ({ children, style, ...rest }: {
        children?: default_2.ReactNode;
        style?: default_2.CSSProperties;
    }) => default_3.JSX.Element;
    useSearchContextContent: () => Record<string, {
        path: string;
        title: string;
        content: string;
    }>;
    useAppLayoutContext: typeof xmluiExports.useAppLayoutContext;
    StyleProvider: typeof xmluiExports.StyleProvider;
    StyleRegistry: typeof xmluiExports.StyleRegistry;
    useEvent: UseEventOverload_2;
    StandaloneComponent: typeof xmluiExports.StandaloneComponent;
    Theme: typeof xmluiExports.Theme;
    ToneSwitch: default_2.ForwardRefExoticComponent<ToneSwitchProps_2 & default_2.RefAttributes<HTMLDivElement>>;
    Tooltip: default_2.ForwardRefExoticComponent<TooltipOptions_2 & {
        open?: boolean;
        text: string;
        markdown?: string;
        tooltipTemplate?: default_2.ReactNode;
        children?: default_2.ReactNode;
    } & default_2.RefAttributes<HTMLDivElement>>;
    DropdownMenu: default_2.ForwardRefExoticComponent<{
        triggerTemplate?: default_2.ReactNode;
        children?: default_2.ReactNode;
        label?: string;
        registerComponentApi?: xmluiExports.RegisterComponentApiFn;
        style?: default_2.CSSProperties;
        className?: string;
        alignment?: AlignmentOptions_2;
        onWillOpen?: () => Promise<boolean | undefined>;
        disabled?: boolean;
        triggerButtonVariant?: string;
        triggerButtonThemeColor?: string;
        triggerButtonIcon?: string;
        triggerButtonIconPosition?: IconPosition_2;
        compact?: boolean;
        modal?: boolean;
    } & default_2.RefAttributes<HTMLButtonElement>>;
    MenuItem: default_2.ForwardRefExoticComponent<{
        icon?: default_2.ReactNode;
        iconPosition?: IconPosition_2;
        onClick?: (event: any) => void;
        children?: default_2.ReactNode;
        label?: string;
        style?: default_2.CSSProperties;
        className?: string;
        to?: string;
        active?: boolean;
        enabled?: boolean;
        compact?: boolean;
    } & default_2.RefAttributes<unknown>>;
    ContentSeparator: default_2.ForwardRefExoticComponent<{
        thickness?: number | string;
        length?: number | string;
        orientation?: string;
        hasExplicitLength?: boolean;
        style?: default_2.CSSProperties;
        className?: string;
    } & default_2.RefAttributes<HTMLDivElement>>;
    MemoizedItem: default_2.MemoExoticComponent<({ node, renderChild, layoutContext, contextVars, }: {
        node: xmluiExports.ComponentDef | Array<xmluiExports.ComponentDef>;
        renderChild: RenderChildFn_2;
        layoutContext?: LayoutContext_2;
        contextVars?: Record<string, any>;
    }) => default_3.JSX.Element>;
};
export default standaloneExports;

/**
 * This class allows external component libraries to add their components to
 * the xmlui component registry. The framework resolves the components used
 * in an application markup with this registry.
 */
declare class StandaloneExtensionManager {
    subscriptions: Set<ExtensionRegisteredCallbackFn>;
    registeredExtensions: Array<Extension>;
    constructor();
    /**
     * You can add a callback function invoked whenever a new component is added
     * to the registry. When you register a new callback function, the component
     * manager automatically invokes it for all components already in the
     * registry.
     * @param cb Function to call when a new component is registered
     */
    subscribeToRegistrations(cb: ExtensionRegisteredCallbackFn): void;
    /**
     * You can remove a function added by `subscribeToRegistrations`. After
     * calling this method, the particular callback function won't be invoked
     * for a new component registration.
     * @param cb Function to call when a new component is registered
     */
    unSubscribeFromRegistrations(cb: ExtensionRegisteredCallbackFn): void;
    registerExtension(component: Extension | Extension[]): void;
}

declare type StandaloneJsonConfig = {
    name?: string;
    appGlobals?: Record<string, any>;
    entryPoint?: string;
    components?: string[];
    themes?: string[];
    defaultTheme?: string;
    resources?: Record<string, string>;
    resourceMap?: Record<string, string>;
    apiInterceptor?: ApiInterceptorDefinition;
};

/**
 * This function injects the StandaloneApp component into a React app. It looks
 * up a component with the "root" id as the host of the standalone app. If such
 * an element does not exist, it creates a `<div id="root">` element.
 * @param runtime The app's runtime representation
 * @param components The related component's runtime representation
 * @returns The content's root element
 */
declare function startApp(runtime: any, extensions?: Extension[] | Extension, extensionManager?: StandaloneExtensionManager): Root;

declare type State = {
    hasError: boolean;
    error: Error | null;
};

declare type Statement = BlockStatement | EmptyStatement | ExpressionStatement | ArrowExpressionStatement | LetStatement | ConstStatement | VarStatement | IfStatement | ReturnStatement | BreakStatement | ContinueStatement | WhileStatement | DoWhileStatement | ForStatement | ForInStatement | ForOfStatement | ThrowStatement | TryStatement | SwitchStatement | FunctionDeclaration | ImportDeclaration | ImportSpecifier;

declare interface StyleCacheEntry {
    className: string;
    styleHash: string;
    css: string;
}

declare type StyleObjectType = CSSProperties & {
    [selectorOrAtRule: string]: StyleObjectType | CSSProperties[keyof CSSProperties];
};

/**
 * A "smart" provider that creates a StyleRegistry only if one doesn't
 * already exist in the context.
 */
declare function StyleProvider({ children, styleRegistry, forceNew, }: StyleProviderProps): JSX_2.Element;

declare type StyleProviderProps = {
    children: default_2.ReactNode;
    styleRegistry?: StyleRegistry;
    forceNew?: boolean;
};

declare class StyleRegistry {
    cache: Map<string, StyleCacheEntry>;
    rootClasses: Set<string>;
    injected: Set<string>;
    refCounts: Map<string, number>;
    ssrHashes: Set<string>;
    register(styles: StyleObjectType): StyleCacheEntry;
    /**
     * [PRIVATE] Recursively generates CSS rules from a style object.
     * This is the new, more powerful engine.
     * @param selector - The CSS selector for the current context (e.g., '.css-123' or '&:hover').
     * @param styles - The style object to process.
     * @returns A string of CSS rules.
     */
    private _generateCss;
    private _processNestedRule;
    getSsrStyles(): string;
    /**
     * Adds a class name to be applied to the <html> tag.
     */
    addRootClasses(classNames: Array<string>): void;
    /**
     * Returns a space-separated string of all collected html classes.
     */
    getRootClasses(): string;
    getRefCount(styleHash: string): number;
    /**
     * Increments the reference count for a given style hash.
     */
    incrementRef(styleHash: string): void;
    /**
     * Decrements the reference count for a given style hash.
     * @returns {number} The new reference count.
     */
    decrementRef(styleHash: string): number;
}

declare type SWITCH_CASE = typeof T_SWITCH_CASE;

declare type SWITCH_STATEMENT = typeof T_SWITCH_STATEMENT;

declare interface SwitchCase extends ExpressionBase {
    type: SWITCH_CASE;
    caseE?: Expression;
    stmts?: Statement[];
}

declare interface SwitchStatement extends ScripNodeBase {
    type: SWITCH_STATEMENT;
    expr: Expression;
    cases: SwitchCase[];
}

declare type SyncFunction = (...args: any) => any;

declare const T_ARRAY_DESTRUCTURE: number;

declare const T_ARRAY_LITERAL: number;

declare const T_ARROW_EXPRESSION: number;

declare const T_ARROW_EXPRESSION_STATEMENT: number;

declare const T_ASSIGNMENT_EXPRESSION: number;

declare const T_ASYNC_FUNCTION_DECLARATION: number;

declare const T_AWAIT_EXPRESSION: number;

declare const T_BINARY_EXPRESSION: number;

declare const T_BLOCK_STATEMENT: number;

declare const T_BREAK_STATEMENT: number;

declare const T_CALCULATED_MEMBER_ACCESS_EXPRESSION: number;

declare const T_CONDITIONAL_EXPRESSION: number;

declare const T_CONST_STATEMENT: number;

declare const T_CONTINUE_STATEMENT: number;

declare const T_DESTRUCTURE: number;

declare const T_DO_WHILE_STATEMENT: number;

declare const T_EMPTY_STATEMENT: number;

declare const T_EXPRESSION_STATEMENT: number;

declare const T_FOR_IN_STATEMENT: number;

declare const T_FOR_OF_STATEMENT: number;

declare const T_FOR_STATEMENT: number;

declare const T_FUNCTION_DECLARATION: number;

declare const T_FUNCTION_INVOCATION_EXPRESSION: number;

declare const T_IDENTIFIER: number;

declare const T_IF_STATEMENT: number;

declare const T_IMPORT_DECLARATION: number;

declare const T_IMPORT_SPECIFIER: number;

declare const T_LET_STATEMENT: number;

declare const T_LITERAL: number;

declare const T_MEMBER_ACCESS_EXPRESSION: number;

declare const T_NEW_EXPRESSION: number;

declare const T_NO_ARG_EXPRESSION: number;

declare const T_OBJECT_DESTRUCTURE: number;

declare const T_OBJECT_LITERAL: number;

declare const T_POSTFIX_OP_EXPRESSION: number;

declare const T_PREFIX_OP_EXPRESSION: number;

declare const T_REACTIVE_VAR_DECLARATION: number;

declare const T_RETURN_STATEMENT: number;

declare const T_SEQUENCE_EXPRESSION: number;

declare const T_SPREAD_EXPRESSION: number;

declare const T_SWITCH_CASE: number;

declare const T_SWITCH_STATEMENT: number;

declare const T_TEMPLATE_LITERAL_EXPRESSION: number;

declare const T_THROW_STATEMENT: number;

declare const T_TRY_STATEMENT: number;

declare const T_UNARY_EXPRESSION: number;

declare const T_VAR_DECLARATION: number;

declare const T_VAR_STATEMENT: number;

declare const T_WHILE_STATEMENT: number;

declare type Tab = {
    id?: string;
    label: string;
    headerRenderer?: (contextVars: any) => ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
    activated?: () => void;
};

declare const TabItemComponent: ForwardRefExoticComponent<Tab & RefAttributes<HTMLDivElement>>;

declare type TableDescriptor = {
    name: string;
    fields?: Record<string, any>;
    pk: Array<string>;
    indexes?: Array<string>;
};

declare const Tabs: ForwardRefExoticComponent<Props_3 & RefAttributes<HTMLDivElement>>;

declare type TEMPLATE_LITERAL_EXPRESSION = typeof T_TEMPLATE_LITERAL_EXPRESSION;

declare interface TemplateLiteralExpression extends ExpressionBase {
    type: TEMPLATE_LITERAL_EXPRESSION;
    segments: (Literal | Expression)[];
}

declare const Text_2: default_2.ForwardRefExoticComponent<Omit<TextProps, "ref"> & default_2.RefAttributes<unknown>>;

declare const TextBox: default_2.ForwardRefExoticComponent<Props_5 & default_2.RefAttributes<HTMLDivElement>>;

declare type TextProps = {
    uid?: string;
    children?: default_2.ReactNode;
    variant?: TextVariant;
    maxLines?: number;
    preserveLinebreaks?: boolean;
    ellipses?: boolean;
    overflowMode?: OverflowMode;
    breakMode?: BreakMode;
    style?: CSSProperties;
    className?: string;
    onContextMenu?: any;
    registerComponentApi?: RegisterComponentApiFn;
    [variantSpecificProps: string]: any;
};

declare type TextVariant = (typeof TextVariantKeys)[number];

declare const TextVariantKeys: readonly ["abbr", "cite", "code", "deleted", "inherit", "inserted", "keyboard", "marked", "sample", "sub", "sup", "var", "strong", "em", "mono", "title", "subtitle", "small", "caption", "placeholder", "paragraph", "subheading", "tableheading", "secondary"];

declare function Theme({ id, isRoot, applyIf, disableInlineStyle, renderChild, node, tone, toastDuration, themeVars, layoutContext, children, }: Props_7): string | number | boolean | Iterable<ReactNode> | JSX_2.Element;

declare interface ThemeDefinition extends ThemeDefinitionDetails {
    id: string;
    name?: string;
    extends?: string | Array<string>;
    tones?: Record<string | ThemeTone, ThemeDefinitionDetails>;
    color?: string;
}

declare interface ThemeDefinitionDetails {
    themeVars?: Record<string, string>;
    resources?: Record<string, string | FontDef>;
}

declare type ThemeIdDescriptor = {
    id: string;
    defaultValue?: DefaultValueDescriptor;
};

declare type ThemeScope = {
    activeThemeId: string;
    activeThemeTone: ThemeTone;
    root: HTMLElement | undefined;
    setRoot: Dispatch<SetStateAction<HTMLElement | undefined>>;
    activeTheme: ThemeDefinition;
    themeStyles: Record<string, string>;
    themeVars: Record<string, string>;
    getResourceUrl: (resourceString?: string) => string | undefined;
    getThemeVar: (themeVar: string) => string | undefined;
    disableInlineStyle?: boolean;
};

declare type ThemeTone = "light" | "dark";

declare type THROW_STATEMENT = typeof T_THROW_STATEMENT;

declare interface ThrowStatement extends ScripNodeBase {
    type: THROW_STATEMENT;
    expr: Expression;
}

declare type ToastHandler = (message: Message, options?: ToastOptions) => string;

/**
 * Converts the specified themeID to a CSS var string
 * @param c segment to convert
 */
declare function toCssVar(c: string | ThemeIdDescriptor): string;

declare enum TokenType {
    Eof = -1,
    Ws = -2,
    BlockComment = -3,
    EolComment = -4,
    Unknown = 0,
    LParent = 1,
    RParent = 2,
    Identifier = 3,
    Exponent = 4,
    Divide = 5,
    Multiply = 6,
    Remainder = 7,
    Plus = 8,
    Minus = 9,
    BitwiseXor = 10,
    BitwiseOr = 11,
    LogicalOr = 12,
    BitwiseAnd = 13,
    LogicalAnd = 14,
    IncOp = 15,
    DecOp = 16,
    Assignment = 17,
    AddAssignment = 18,
    SubtractAssignment = 19,
    ExponentAssignment = 20,
    MultiplyAssignment = 21,
    DivideAssignment = 22,
    RemainderAssignment = 23,
    ShiftLeftAssignment = 24,
    ShiftRightAssignment = 25,
    SignedShiftRightAssignment = 26,
    BitwiseAndAssignment = 27,
    BitwiseXorAssignment = 28,
    BitwiseOrAssignment = 29,
    LogicalAndAssignment = 30,
    LogicalOrAssignment = 31,
    NullCoalesceAssignment = 32,
    Semicolon = 33,
    Comma = 34,
    Colon = 35,
    LSquare = 36,
    RSquare = 37,
    QuestionMark = 38,
    NullCoalesce = 39,
    OptionalChaining = 40,
    BinaryNot = 41,
    LBrace = 42,
    RBrace = 43,
    Equal = 44,
    StrictEqual = 45,
    LogicalNot = 46,
    NotEqual = 47,
    StrictNotEqual = 48,
    LessThan = 49,
    LessThanOrEqual = 50,
    ShiftLeft = 51,
    GreaterThan = 52,
    GreaterThanOrEqual = 53,
    ShiftRight = 54,
    SignedShiftRight = 55,
    Dot = 56,
    Spread = 57,
    Global = 58,
    Backtick = 59,
    DollarLBrace = 60,
    Arrow = 61,
    DecimalLiteral = 62,
    HexadecimalLiteral = 63,
    BinaryLiteral = 64,
    RealLiteral = 65,
    StringLiteral = 66,
    Infinity = 67,
    NaN = 68,
    True = 69,
    False = 70,
    Typeof = 71,
    Null = 72,
    Undefined = 73,
    In = 74,
    Let = 75,
    Const = 76,
    Var = 77,
    If = 78,
    Else = 79,
    Return = 80,
    Break = 81,
    Continue = 82,
    Do = 83,
    While = 84,
    For = 85,
    Of = 86,
    Try = 87,
    Catch = 88,
    Finally = 89,
    Throw = 90,
    Switch = 91,
    Case = 92,
    Default = 93,
    Delete = 94,
    Function = 95,
    New = 96,
    As = 97,
    Import = 98,
    From = 99
}

declare function ToneChangerButton({ lightToDarkIcon, darkToLightIcon, onClick, }: {
    lightToDarkIcon?: string;
    darkToLightIcon?: string;
    onClick?: (...args: any[]) => void;
}): JSX_2.Element;

declare const ToneSwitch: ForwardRefExoticComponent<ToneSwitchProps & RefAttributes<HTMLDivElement>>;

declare type ToneSwitchProps = {
    /**
     * Icon to display for light mode
     * @default "sun"
     */
    iconLight?: string;
    /**
     * Icon to display for dark mode
     * @default "moon"
     */
    iconDark?: string;
    className?: string;
    onChange?: (tone: "light" | "dark") => void;
};

declare const Tooltip: ForwardRefExoticComponent<TooltipOptions & {
/**
* The open state of the tooltip externally controlled
*/
open?: boolean;
/**
* The text content to display in the tooltip
*/
text: string;
/**
* The markdown content to display in the tooltip
*/
markdown?: string;
/**
* The template for the tooltip content
*/
tooltipTemplate?: ReactNode;
/**
* The content that will trigger the tooltip (used when triggerRef is not provided)
*/
children?: ReactNode;
} & RefAttributes<HTMLDivElement>>;

declare type TooltipOptions = {
    /**
     * The duration from when the mouse enters a tooltip trigger until the tooltip opens
     */
    delayDuration?: number;
    /**
     * How much time a user has to enter another trigger without incurring a delay again
     */
    skipDelayDuration?: number;
    /**
     * The open state of the tooltip when it is initially rendered
     */
    defaultOpen?: boolean;
    /**
     * Whether to show the arrow pointing to the trigger element
     */
    showArrow?: boolean;
    /**
     * The preferred side of the trigger to render against when open
     */
    side?: "top" | "right" | "bottom" | "left";
    /**
     * The preferred alignment against the trigger
     */
    align?: "start" | "center" | "end";
    /**
     * The distance in pixels from the trigger
     */
    sideOffset?: number;
    /**
     * An offset in pixels from the "start" or "end" alignment options
     */
    alignOffset?: number;
    /**
     * When true, overrides the side and align preferences to prevent collisions with boundary edges
     */
    avoidCollisions?: boolean;
};

/**
 * Type definition for a topic subscription callback.
 * @param topic The topic that was published
 * @param data The data payload sent with the topic
 */
declare type TopicCallback = (topic: string | number, data: any) => void;

declare type TrackContainerHeight = "auto" | "fixed";

declare interface TreeNode {
    id: string | number;
    key: string | number;
    path: any[];
    displayName?: string;
    children?: TreeNode[];
    parentIds: (string | number)[];
    selectable: boolean;
    loaded?: boolean;
    [x: string]: any;
}

declare type TRY_STATEMENT = typeof T_TRY_STATEMENT;

declare interface TryStatement extends ScripNodeBase {
    type: TRY_STATEMENT;
    tryB: BlockStatement;
    catchB?: BlockStatement;
    catchV?: Identifier;
    finallyB?: BlockStatement;
}

declare type UNARY_EXPRESSION = typeof T_UNARY_EXPRESSION;

declare interface UnaryExpression extends ExpressionBase {
    type: UNARY_EXPRESSION;
    op: UnaryOpSymbols;
    expr: Expression;
}

declare type UnaryOpSymbols = "+" | "-" | "~" | "!" | "typeof" | "delete";

declare type UpdateStateFn = (componentState: any, options?: any) => void;

declare function useAppLayoutContext(): IAppLayoutContext;

declare function useColors(...colorNames: (string | ColorDef)[]): Record<string, string>;

declare function useDevTools(): {
    projectCompilation: ProjectCompilation;
    inspectedNode: any;
    sources: Record<string, string>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    devToolsEnabled: boolean;
    mockApi: any;
    clickPosition: {
        x: number;
        y: number;
    };
};

declare const useEvent: UseEventOverload;

declare interface UseEventOverload {
    <TF extends callbackType>(callback: TF): TF;
    <TF extends callbackType>(callback: TF): any;
}

declare const useLogger: () => LogContextType;

declare const useSearchContextContent: () => Record<string, SearchEntry>;

declare function useTheme(): ThemeScope;

declare function useThemes(): AppThemes;

declare type ValidationStatus = (typeof validationStatusValues)[number];

declare const validationStatusValues: readonly ["none", "error", "warning", "valid"];

declare type ValueExtractor = {
    (expression?: any, strict?: boolean): any;
    asString(expression?: any): string;
    asOptionalString<T extends string>(expression?: any, defValue?: string): T | undefined;
    asOptionalStringArray(expression?: any): (string | undefined)[];
    asDisplayText(expression?: any): string;
    asNumber(expression?: any): number;
    asOptionalNumber(expression?: any, defValue?: number): number | undefined;
    asBoolean(expression?: any): boolean;
    asOptionalBoolean(expression?: any, defValue?: boolean): boolean | undefined;
    asSize(expression?: any): string;
};

declare type VAR_DECLARATION = typeof T_VAR_DECLARATION;

declare type VAR_STATEMENT = typeof T_VAR_STATEMENT;

declare interface VarDeclaration extends ExpressionBase {
    type: VAR_DECLARATION;
    id?: string;
    aDestr?: ArrayDestructure[];
    oDestr?: ObjectDestructure[];
    expr?: Expression;
}

declare interface VarStatement extends ScripNodeBase {
    type: VAR_STATEMENT;
    decls: ReactiveVarDeclaration[];
}

declare interface VisualCondition extends ConditionBase {
    type: "visual";
}

declare const VisuallyHidden: ({ children, ...props }: {
    children: React.ReactNode;
}) => JSX_2.Element;

declare type WHILE_STATEMENT = typeof T_WHILE_STATEMENT;

declare interface WhileStatement extends ScripNodeBase {
    type: WHILE_STATEMENT;
    cond: Expression;
    body: Statement;
}

declare interface XmlUiAttribute extends XmlUiNodeBase {
    type: "XmlUiAttribute";
    name: string;
    namespace?: string;
    value?: string;
    preserveQuotes?: boolean;
    preserveSpaces?: boolean;
}

declare interface XmlUiComment extends XmlUiNodeBase {
    type: "XmlUiComment";
    text?: string;
}

declare interface XmlUiElement extends XmlUiNodeBase {
    type: "XmlUiElement";
    name: string;
    namespace?: string;
    attributes?: XmlUiAttribute[];
    text?: string;
    preserveSpaces?: boolean;
    childNodes?: XmlUiNode[];
}

declare namespace xmluiExports {
    export {
        ThemeDefinition,
        ComponentDef,
        ComponentRendererDef,
        CompoundComponentDef,
        PropertyValueDescription,
        ComponentLike,
        StandaloneAppDescription,
        StandaloneJsonConfig,
        ApiInterceptorDefinition,
        RegisterComponentApiFn,
        TreeNode,
        RendererContext,
        ComponentMetadata,
        ThemeTone,
        XmlUiNode,
        StandaloneApp,
        StandaloneExtensionManager,
        createComponentRenderer,
        createUserDefinedComponentRenderer,
        createMetadata,
        d,
        dComponent,
        dAutoFocus,
        dClick,
        dCollapse,
        dDidChange,
        dDidClose,
        dDidOpen,
        dEnabled,
        dFocus,
        dEndIcon,
        dEndText,
        dExpanded,
        dExpand,
        dGotFocus,
        dIndeterminate,
        dInit,
        dInitialValue,
        dInternal,
        dLabel,
        dLabelBreak,
        dLabelPosition,
        dLabelWidth,
        dLostFocus,
        dMaxLength,
        dMulti,
        dOrientation,
        dPlaceholder,
        dReadonly,
        dRequired,
        dStartIcon,
        dStartText,
        dSetValueApi,
        dTriggerTemplate,
        dValidationStatus,
        dValue,
        dValueApi,
        parseScssVar,
        startApp,
        useTheme,
        AppRoot,
        ErrorBoundary,
        Icon,
        Stack,
        Button,
        Splitter,
        getColor,
        TabItemComponent as TabItem,
        Tabs,
        useColors,
        toCssVar,
        useDevTools,
        useLogger,
        errReportComponent,
        xmlUiMarkupToComponent,
        ApiInterceptorProvider,
        Spinner,
        useThemes,
        builtInThemes,
        XmlUiHelper,
        Text_2 as Text,
        TextBox,
        NestedApp,
        VisuallyHidden,
        LinkNative,
        ToneChangerButton,
        NavPanelCollapseButton,
        Logo,
        Breakout,
        useSearchContextContent,
        useAppLayoutContext,
        StyleProvider,
        StyleRegistry,
        useEvent,
        StandaloneComponent,
        Theme,
        ToneSwitch,
        Tooltip,
        DropdownMenu,
        MenuItem,
        ContentSeparator,
        MemoizedItem
    }
}

declare type XmlUiFragment = XmlUiNode | XmlUiNode[];

/**
 * Helper class for XMLUI serialization and parsing
 */
declare class XmlUiHelper {
    /**
     * Serialize the specified XML fragment into a string
     * @param xml XML fragment to serialize
     * @param options Formatting options to use
     */
    serialize(xml: XmlUiFragment, options?: XmluiSerializationOptions): string;
    /**
     * Transform the specified component definition into an XMLUI node
     * @param def Component definitions
     * @param options Transformation options
     */
    transformComponentDefinition(def: ComponentDef | CompoundComponentDef, options?: XmlUiTransformOptions): XmlUiFragment;
    /**
     * Transform the specified object into an XMLUI nodes
     * @param def Object definition
     * @param options Transformation options
     */
    transformObject(def: Record<string, any>, options?: XmlUiTransformOptions): XmlUiNode[] | null;
    /**
     * Transforms the specified simple component definition into an XMLUI node
     * @param def Component definition
     * @param options Transformation options
     */
    private transformSimpleComponentDefinition;
    /**
     * Transforms the specified simple component definition into an Xml node
     * @param def Compound component definition
     * @param options Transformation options
     */
    private transformCompoundComponentDefinition;
    /**
     * Transforms a value into an XMLUI element
     * @param nodeName Name of the value node
     * @param name Optional (property) name
     * @param value Value to transform
     * @param options Transformation options
     */
    private transformValue;
    /**
     * Transforms the specified simple component definition into an Xml node
     * @param name Element name
     * @param value Value to transform
     * @param options Transformation options
     */
    private transformObjectValue;
    /**
     * Add a property to the specified XMLUI element
     * @param element XML element
     * @param name Element name
     * @param value Element value
     * @param options Transformation options
     */
    private addProperty;
    private addComponentElement;
    /**
     * Adds a list to the specified XML element
     * @param element XML element
     * @param name Name of the list (child in `element`)
     * @param prefix Prefix to use for the list
     * @param list List with items
     * @param options Transformation options
     */
    private addList;
    /**
     * Adds a component list to the specified element
     * @param element XML element
     * @param name Name to use for the wrapper element
     * @param list List with component items
     * @private
     */
    private addComponentList;
}

declare function xmlUiMarkupToComponent(source: string, fileId?: string | number, preResolvedImports?: CollectedDeclarations): ParserResult;

declare type XmlUiNode = XmlUiComment | XmlUiAttribute | XmlUiElement;

declare interface XmlUiNodeBase {
    type: XmlUiNode["type"];
}

declare type XmluiSerializationOptions = {
    prettify?: boolean;
    indents?: number;
    lineLength?: number;
    useQuotes?: boolean;
    useSpaceBeforeClose?: boolean;
    breakClosingTag?: boolean;
};

/**
 * Options to use with markup transformation from memory format to XMLUI structure
 */
declare type XmlUiTransformOptions = {
    preserveLineBreaks?: boolean;
    preserveSpecialChars?: boolean;
    removeQuotes?: boolean;
    extractProps?: boolean;
    preferTextToValue?: boolean;
};

export { }


declare module "@tanstack/table-core" {
    interface TableMeta<TData extends RowData> {
        cellRenderer: (...args: any[]) => any;
    }
    interface ColumnMeta<TData extends RowData, TValue> {
        style?: CSSProperties;
        className?: string;
        starSizedWidth?: string;
        accessorKey?: string;
        pinTo?: string;
        cellRenderer?: (row: any, rowIdx: number, colIdx: number, value?: any) => ReactNode;
    }
}


declare global {
    interface Window {
        TEST_ENV: any | undefined;
        TEST_RUNTIME: any;
        TEST_EXTENSION_IDS?: string[];
    }
}
