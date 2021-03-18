const SignIn = lazy(() => import("./containers/SignIn"));
const  CreateBrand = lazy(() => import("./containers/brand/create"));
const  CreateKoovsBrand = lazy(() => import("./containers/brand/create_koovs"));
const  ListBrand = lazy(() => import("./containers/brand/list"));
const  ListRoles = lazy(() => import("./containers/roles/list"));
const  CreateRoles = lazy(() => import("./containers/roles/create"));
const  AssignEditRoles = lazy(() => import("./containers/roles/assignEdit"));
const  AssignRoles = lazy(() => import("./containers/roles/assign"));
const  CreateParentCategory = lazy(() => import("./containers/category/create_parent"));
const  ListParentCategory = lazy(() => import("./containers/category/list_parent"));
const  CreateChildCategory = lazy(() => import("./containers/category/create_child"));
const  ListChildCategory = lazy(() => import("./containers/category/list_child"));
const  CreateAttribute = lazy(() => import("./containers/attribute/create"));
const  ListAttribute = lazy(() => import("./containers/attribute/list"));
const  CreateAttributeValue = lazy(() => import("./containers/attributevalue/create"));
const  ListAttributeValue = lazy(() => import("./containers/attributevalue/list"));
const  CreateProducts = lazy(() => import("./containers/product/create"));
const  IndexProducts = lazy(() => import("./containers/product/indexproduct"));
const  BatchProduct = lazy(() => import("./containers/product/batchproduct"));
const  ListProducts = lazy(() => import("./containers/product/list"));
const  AddProductMeasurement = lazy(() => import("./containers/product/addmeasurement"));
const  ListMeasurement = lazy(() => import("./containers/product/listmeasurement"));
const  MapMeasurement = lazy(() => import("./containers/product/addprodmeasure"));
const  ViewProduct = lazy(() => import("./containers/product/view"));
const  ViewLogs = lazy(() => import("./containers/product/logs"));
const  AddProductImages = lazy(() => import("./containers/product/addimages"));
const  SkuStatus = lazy(() => import("./containers/Catalogue/SkuStatus"));
const  AddColorCode = lazy(() => import("./containers/Catalogue/AddColorCode"));
const  MapColorCode = lazy(() => import("./containers/Catalogue/MapColorCode"));
const  HsnMapping = lazy(() => import("./containers/Catalogue/HsnMapping"));
const  ShopTheLookCreate = lazy(() => import("./containers/ShopTheLook/create"));
const  ShopTheLookList = lazy(() => import("./containers/ShopTheLook/list"));
const  SapManagement = lazy(() => import("./containers/sap/sapmanagement"));
const  ListGenericPromo = lazy(() => import("./containers/promo/list_generic_promo"));
const  AddGenericPromo = lazy(() => import("./containers/promo/create_generic_promo"));
const  ListUserPromo = lazy(() => import("./containers/promo/list_user_promo"));
const  AddUserPromo = lazy(() => import("./containers/promo/create_user_promo"));
const  ListPromotionalPromo = lazy(() => import("./containers/promo/list_promotional_promo"));
const  AddPromotionalPromo = lazy(() => import("./containers/promo/create_promotional_promo"));
const  ListBankOfferPromo = lazy(() => import("./containers/promo/list_bank_offer_promo"));
const  ListBankOfferPromoCache = lazy(() => import("./containers/promo/bank_offer_cache"));
const  AddBankOfferPromo = lazy(() => import("./containers/promo/create_bank_offer_promo"));
const  MultiUserPromo = lazy(() => import("./containers/promo/multiuserpromo"));
const  NotAuthorized = lazy(() => import("./containers/NotAuthorized/not_authorized"));
const  PromoListActive = lazy(() => import("./containers/promo/PromoListActive"));
const  VMUploadCSVPage = lazy(() => import("./containers/virtualMerchandise/UploadCSV"));
import { namespace } from "../config";
import Reporting from './containers/reporting'
import s3Reports from './containers/s3reports'
import {
  OrderList,
  StartedList,
  ReversePickup,
  AssignRefund,
  ProcessRefund,
  PendingRefund,
  ExchangeReplace,
  BulkOrderCancellation,
  ViewTransactionHistory,
  UnusableShipment,
  TxnStatusChange,
  ReturnExchangeSelfShips,
  RevertFTRefundStatus,
  DeliveryUpdate,
  StatusUpdate,
  ReturnDelivered,
  UserDetails,
  CurrentStatus
} from "./containers/Order";
import {
  CallCenterSearch,
  UserDetailSearch,
  UserCart,
  SearchPincode,
  TrackOrder,
  TempCart,
  ReturnExchange,
  ReturnExchangeType,
  PaymentDetails,
  CustomerPicodeCourier
} from "./containers/CallCenter";
import {
  UploadDiscount,
  PriceScheduler,
  GetSkuDetail,
  UpdateInventory,
  OverrideInventory
} from "./containers/Pricing";
import { Home, List, Create, Detail, View } from "./containers/Asn";
import { ListTagging, CreateTag, Mapping, ViewTag } from "./containers/Tagging";
import ChangePassword from "./containers/ChangePassword";
import SizeMap from "./containers/sizeMap/index";
import { CreateMenu, ListMenu, ForceUpdate } from "./containers/CmsAdmin";
import CreateSeo from "./containers/seo/create";
import ListSeo from "./containers/seo/list";
import CreateVendor from "./containers/vendor/create";
import ListVendor from "./containers/vendor/list";
import CreateReferral from "./containers/referral/create";
import ListReferral from "./containers/referral/list";
import PaymentOptions from "./containers/payment/list";
import {
  Inventory,
  Pricing,
  Tagging,
  Promo,
  PricingScheduled,
  Product
} from "./containers/AuditLogs";
import NavSync from "./containers/NavSync/sync";
import {
  Widgets,
  AddWidget,
  Templates,
  AddTemplate,
  Version,
  ListBanner,
  PaymentBanner,
  EditConfig
} from "./containers/BannerCms";
import CreatePincode from "./containers/lsp/createPincode";
import CreateZone from "./containers/lsp/createZones";
import ListPincode from "./containers/lsp/listPincode";
import ListZones from "./containers/lsp/listZones";
import pinCodeServicability from "./containers/lsp/pinCodeServicability";
import ListCourier from "./containers/lsp/list";
import CreateCourier from "./containers/lsp/create";

export const routesPath = {
  SIGNIN: "/login",
  HOME: "/",
  ASN_LIST: "/asn/list",
  ASN_LIST_FILTER: "/asn/list/:filter",
  ASN_CREATE: "/asn/create",
  ASN_DETAILS: "/asn/detail/*",
  ASN_VIEW: "/asn/view/*",
  ASN_EDIT: "/asn/edit/*",
  CATALOGUE_BRAND_TYPE: "/catalogue/brand/:type/:id?",
  CATALOGUE_LIST_BRAND: "/catalogue/list/brand",
  CATALOGUE_SEO_TYPE: "/catalogue/banner/:type/:id?",
  CATALOGUE_LIST_SEO: "/catalogue/list/banner",
  CATALOGUE_CATEGORY_PARENT_TYPE: "/catalogue/category/parent/:type/:id?",
  CATALOGUE_LIST_PARENT_CATEGORY: "/catalogue/list/parent/category",
  CATALOGUE_CATEGORY_CHILD_TYPE: "/catalogue/category/child/:type/:id?",
  CATALOGUE_LIST_CHILD_CATEGORY:
    "/catalogue/list/child/category/:parent_id/:parent_name",
  CATALOGUE_ATTRIBUTE_TYPE: "/catalogue/attribute/:type/:id?",
  CATALOGUE_LIST_ATTRIBUTE: "/catalogue/list/attribute",
  CATALOGUE_ATTRIBUTE_VALUE: "/catalogue/attribute-value/:type/:id?",
  CATALOGUE_LIST_ATTRIBUTE_VALUE:
    "/catalogue/list/attribute-value/:attr_id/:attr_name",
  CATALOGUE_PRODUCT_TYPE: "/catalogue/product/:type/:id?",
  CATALOGUE_PRODUCT_INDEX: "/catalogue/indexproduct",
  CATALOGUE_BATCH_ADD: "/catalogue/batchadd/product",
  CATALOGUE_BATCH_UPDATE: "/catalogue/batchupdate/product",
  CATALOGUE_BATCH_DOWNLOAD: "/catalogue/batchdownload/sku",
  CATALOGUE_BATCH_LINECHANGE: "/catalogue/batchlinestatuschange",
  CATALOGUE_VIEW_PRODUCT: "/catalogue/view/product/:id/:liveStatus",
  CATALOGUE_VIEW_LOGS: "/catalogue/logs/product/:id",
  CATALOGUE_LIST_PRODUCT: "/catalogue/list/product",
  CATALOGUE_PRODUCT_IMAGE: "/catalogue/product-image/",
  CATALOGUE_LIST_MEASUREMENT: "/catalogue/list/measurement/",
  CATALOGUE_PRODUCT_MEASUREMENT_TYPE:
    "/catalogue/product-measurement/:type/:id?",
  CATALOGUE_PRODUCT_MEASUREMENT: "/catalogue/product-measurement/",
  SHOP_THE_LOOK_CREATE: "/shopthelook/create",
  SHOP_THE_LOOK_EDIT: "/shopthelook/create/:id",
  SHOP_THE_LOOK_LIST: "/shopthelook/list",
  SAP_MANAGEMENT: "/sap/sapmanagement/",
  TAGGING_LIST: "/tagging/list",
  TAGGING_MAPPING: "/tagging/mapping",
  TAGGING_REMOVE: "/tagging/remove",
  TAGGING_VIEW: "/tagging/view/:tagname",
  TAGGING_TYPE_TAGNAME: "/tagging/:type/:tagname?",
  ORDER_TXNS: "/order/txns",
  ORDER_STARTED: "/order/started",
  ORDER_PICK_REVERSE: "/order/pick/reverse",
  ORDER_ASSIGN_REFUND: "/order/assignRefund",
  ORDER_PROCESS_REFUND: "/order/processrefund",
  ORDER_PENDING_REFUND: "/order/pendingrefund",
  ORDER_EXCHANGE_REPLACE: "/order/exchng_repl",
  ORDER_BULK_ORDER_CANCELLATION: "/order/bulkordercancellation",
  ORDER_VIEW_TXN_HISTORY: "/order/viewTxnHistory/:entityid_ref/:txnId",
  ORDER_UNUSABLE_SHIPMENT: "/order/unusable_shipment",
  ORDER_TXN_STATUS_CHANGE: "/order/txn_status_change",
  ORDER_RETURN_EXCHANGE_SELF_SHIPS: "/order/returnExchangeSelfShip",
  ORDER_REVERT_FT_REFUND_STATUS: "/order/revertFTRefundStatus",
  ORDER_DELIVERY_UPDATE: "/order/deliveryUpdate",
  ORDER_RETURN_DELIVERED: "/order/returndelivered",
  ORDER_STATUS_UPDATE: "/order/statusUpdate",
  ORDER_USER_DETAILS: "/order/userdetails",
  ORDER_CURRENT_STATUS: "/order/currentstatus",
  CALL_CENTER_SEARCH: "/call_center/search",
  CALL_CENTER_USER_DETAIL_SEARCH: "/call_center/userDetailSearch/:id",
  CALL_CENTER_USER_CART: "/call_center/userCart",
  CALL_CENTER_SEARCH_PINCODE: "/call_center/searchPincode",
  CALL_CENTER_TRACK_ORDER: "/call_center/track_order",
  CALL_CENTER_RETURN_EXCHANGE: "/call_center/return_exchange",
  CALL_CENTER_RETURN_EXCHANGE_TYPE:
    "/call_center/return_exchange/:type/:orderId/:txnId",
  CALL_CENTER_PAYMENT_DETAILS: "/call_center/payment_details",
  CHANGE_PASSWORD: "/change_password",
  CALL_CENTER_CART: "/call_center/cart",
  PRICING_UPLOAD_DISCOUNT: "/price/uploaddiscount",
  PRICING_SCHEDULED_PRICE: "/price/priceSchedulerDashboard",
  PRICING_GET_SKU_DETAIL: "/price/getSkuDetail",
  PRICING_UPDATE_INVENTORY: "/price/updateInventory",
  PRICING_OVERRIDE_INVENTORY: "/price/overrideInventory",
  LIST_GENERIC_PROMO: "/promo/list/generic",
  CREATE_EDIT_GENERIC_PROMO: "/promo/generic/:type/:id?",
  LIST_USER_PROMO: "/promo/list/user",
  CREATE_EDIT_USER_PROMO: "/promo/user/:type/:id?",
  LIST_PROMOTIONAL_PROMO: "/promo/list/promotional",
  CREATE_EDIT_PROMOTIONAL_PROMO: "/promo/promotional/:type/:id?",
  LIST_BANKOFFER_PROMO: "/promo/list/bankoffer",
  LIST_BANKOFFERCACHE_PROMO: "/promo/list/bankoffercache",
  CREATE_EDIT_BANKOFFER_PROMO: "/promo/bankoffer/:type/:id?",
  CREATE_MULTIUSER_PROMOTIONAL_PROMO: "/promo/multiuser/create",
  PROMO_LIST_ACTIVE: "/promo/list/active",
  SIZE_MAP: "/sizemap/size-map-template",
  NOT_AUTHORIZED: "/not-authorized",
  VIRTUAL_MERCHANDISE: "/virtual-merchandise/upload-csv",
  ROLE_LIST_ROLES: "/role/list/roles",
  ROLE_ASSIGN_ROLE: "/role/assign/roles",
  ROLE_ASSIGN_EDIT_TYPE: "/role/assignRoles/edit/:id?",
  ROLE_ROLE_TYPE: "/role/roles/:type/:id?",
  CATALOGUE_SKU_STATUS: "/catalogue/sku",
  CATALOGUE_ADD_COLOR_CODE: "/catalogue/add-color-code",
  CATALOGUE_MAP_COLOR_CODE: "/catalogue/map-color-code",
  CATALOGUE_HSN: "/catalogue/hsn",
  CALL_CENTER_COURIER_RETURN_PINCODE: "/call_center/courier-return-pincode",
  CMSADMIN_CREATE_MENU: "/headermenu/create-menu",
  CMSADMIN_COPY_MENU: "/headermenu/copy-menu/:id",
  CMSADMIN_EDIT_MENU: "/headermenu/edit-menu/:id",
  CMSADMIN_LIST_MENU: "/headermenu/list-menu",
  CMSADMIN_FORCE_UPDATE: "/headermenu/force-update",
  AUDIT_LOGS_INVENTORY: "/auditlogs/inventory",
  AUDIT_LOGS_PRICING: "/auditlogs/pricing",
  AUDIT_LOGS_PRICING_SCHEDULED: "/auditlogs/pricing/scheduled",
  AUDIT_LOGS_PROMO: "/auditlogs/promo",
  AUDIT_LOGS_TAGGING: "/auditlogs/tagging",
  AUDIT_LOGS_PRODUCT: "/auditlogs/product",
  NAVSYNC: "/navsync/screen",
  BANNERCMS_WIDGETS: "/bannercms/widgets",
  BANNERCMS_ADD_WIDGET: "/bannercms/widgets/add",
  BANNERCMS_TEMPLATES_LIST: "/bannercms/templates",
  BANNERCMS_EDIT_WIDGET: "/bannercms/widgets/edit/:id",
  BANNERCMS_TEMPLATES_ADD: "/bannercms/templates/add",
  // BANNERCMS_TEMPLATES_ADD: "/bannercms/templates/:type/:name?",
  BANNERCMS_TEMPLATES_EDIT: "/bannercms/templates/:type/:name/:version?",
  // BANNERCMS_TEMPLATES_EDIT: "/bannercms/templates/:type/:name",
  BANNERCMS_VERSION: "/bannercms/version",
  BANNERCMS_LISTBANNER: "/bannercms/listbanner",
  BANNERCMS_PAYMENTBANNER: "/bannercms/paymentbanner",
  REFERRAL_CREATE : "/referral_program/:type/:id?",
  REFERRAL_LIST : "/referral_program/ref/list/all",
  PAYMENT_LIST : "/payment/options/list/all",
  PINCODE_CREATE : "/lsp/pincodeCreate/:type/:id?",
  ZONE_CREATE : "/lsp/zoneCreate/:type/:id?",
  ZIPCODE_CREATE : "/lsp/zipcodeCreate/:type/:id?",
  PINCODE_LIST : "/lsp/pincode/list/all",
  ZONES_LIST : "/lsp/zones/list/all",
  COURIER_CREATE : "/lsp/courierCreate/:type/:id?",
  COURIER_LIST : "/lsp/courier/list/all",
  PINCODE_SERVICABILITY: "/lsp/pincodeServicability/list/all",
  BANNERCMS_CONFIG: "/bannercms/config",
  VENDOR_CREATE_VENDOR:"/vendor/vendor/:type/:id?",
  VENDOR_LIST_VENDOR:"/vendor/list/all",
  REPORTING:"/reporting/download/:type",
  DSR:"/reporting/daily-scheduled-reports",
};

export const routes = [
  {
    path: routesPath.SIGNIN,
    exact: true,
    component: SignIn,
    customHeader: false
  },
  {
    path: routesPath.NAVSYNC,
    exact: true,
    component: NavSync,
    customHeader: true
  },
  {
    path: routesPath.NOT_AUTHORIZED,
    exact: true,
    component: NotAuthorized,
    customHeader: false
  },
  {
    path: routesPath.HOME,
    exact: true,
    component: Home,
    customHeader: true
  },
  {
    path: routesPath.ASN_LIST,
    exact: true,
    component: List,
    customHeader: true
  },
  {
    path: routesPath.ASN_LIST_FILTER,
    exact: true,
    component: List,
    customHeader: true
  },
  {
    path: routesPath.ASN_LIST_FILTER,
    exact: true,
    component: List,
    customHeader: true
  },
  {
    path: routesPath.ASN_CREATE,
    exact: true,
    component: Create,
    customHeader: true
  },
  {
    path: routesPath.ASN_DETAILS,
    exact: true,
    component: Detail,
    customHeader: true
  },
  {
    path: routesPath.ASN_VIEW,
    exact: true,
    component: View,
    customHeader: true
  },
  {
    path: routesPath.ASN_EDIT,
    exact: true,
    component: View,
    customHeader: true
  },
  {
    path: routesPath.ROLE_LIST_ROLES,
    exact: true,
    component: ListRoles,
    customHeader: true
  },
  {
    path: routesPath.ROLE_ROLE_TYPE,
    exact: true,
    component: CreateRoles,
    customHeader: true
  },
  {
    path: routesPath.ROLE_ASSIGN_EDIT_TYPE,
    exact: true,
    component: AssignEditRoles,
    customHeader: true
  },
  {
    path: routesPath.ROLE_ASSIGN_ROLE,
    exact: true,
    component: AssignRoles,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_BRAND_TYPE,
    exact: true,
    component: namespace === "koovs" ? CreateKoovsBrand : CreateBrand,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_SEO_TYPE,
    exact: true,
    component: CreateSeo,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_SEO,
    exact: true,
    component: ListSeo,
    customHeader: true
  },
  {
    path: routesPath.VENDOR_CREATE_VENDOR,
    exact: true,
    component: CreateVendor,
    customHeader: true
  },
  {
    path: routesPath.VENDOR_LIST_VENDOR,
    exact: true,
    component: ListVendor,
    customHeader: true
  },
  {
    path: routesPath.REFERRAL_CREATE,
    exact: true,
    component: CreateReferral,
    customHeader: true
  },
  {
    path: routesPath.REFERRAL_LIST,
    exact: true,
    component: ListReferral,
    customHeader: true
  },
  {
    path: routesPath.PAYMENT_LIST,
    exact: true,
    component: PaymentOptions,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_BRAND,
    exact: true,
    component: ListBrand,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_CATEGORY_PARENT_TYPE,
    exact: true,
    component: CreateParentCategory,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_PARENT_CATEGORY,
    exact: true,
    component: ListParentCategory,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_CATEGORY_CHILD_TYPE,
    exact: true,
    component: CreateChildCategory,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_CHILD_CATEGORY,
    exact: true,
    component: ListChildCategory,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_ATTRIBUTE_TYPE,
    exact: true,
    component: CreateAttribute,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_ATTRIBUTE,
    exact: true,
    component: ListAttribute,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_ATTRIBUTE_VALUE,
    exact: true,
    component: CreateAttributeValue,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_ATTRIBUTE_VALUE,
    exact: true,
    component: ListAttributeValue,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_PRODUCT_TYPE,
    exact: true,
    component: CreateProducts,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_PRODUCT_INDEX,
    exact: true,
    component: IndexProducts,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_BATCH_ADD,
    exact: true,
    component: BatchProduct,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_BATCH_UPDATE,
    exact: true,
    component: BatchProduct,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_BATCH_DOWNLOAD,
    exact: true,
    component: BatchProduct,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_BATCH_LINECHANGE,
    exact: true,
    component: BatchProduct,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_VIEW_PRODUCT,
    exact: true,
    component: ViewProduct,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_VIEW_LOGS,
    exact: true,
    component: ViewLogs,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_PRODUCT,
    exact: true,
    component: ListProducts,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_PRODUCT_IMAGE,
    exact: true,
    component: AddProductImages,
    customHeader: true
  },
  {
    path: routesPath.SAP_MANAGEMENT,
    exact: true,
    component: SapManagement,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_LIST_MEASUREMENT,
    exact: true,
    component: ListMeasurement,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_PRODUCT_MEASUREMENT_TYPE,
    exact: true,
    component: AddProductMeasurement,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_PRODUCT_MEASUREMENT,
    exact: true,
    component: MapMeasurement,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_SKU_STATUS,
    exact: true,
    component: SkuStatus,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_ADD_COLOR_CODE,
    exact: true,
    component: AddColorCode,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_MAP_COLOR_CODE,
    exact: true,
    component: MapColorCode,
    customHeader: true
  },
  {
    path: routesPath.CATALOGUE_HSN,
    exact: true,
    component: HsnMapping,
    customHeader: true
  },
  {
    path: routesPath.SHOP_THE_LOOK_CREATE,
    exact: true,
    component: ShopTheLookCreate,
    customHeader: true
  },
  {
    path: routesPath.SHOP_THE_LOOK_EDIT,
    exact: true,
    component: ShopTheLookCreate,
    customHeader: true
  },
  {
    path: routesPath.SHOP_THE_LOOK_LIST,
    exact: true,
    component: ShopTheLookList,
    customHeader: true
  },
  {
    path: routesPath.TAGGING_REMOVE,
    exact: true,
    component: Mapping,
    customHeader: true
  },
  {
    path: routesPath.TAGGING_LIST,
    exact: true,
    component: ListTagging,
    customHeader: true
  },
  {
    path: routesPath.TAGGING_MAPPING,
    exact: true,
    component: Mapping,
    customHeader: true
  },
  {
    path: routesPath.TAGGING_VIEW,
    exact: true,
    component: ViewTag,
    customHeader: true
  },
  {
    path: routesPath.TAGGING_TYPE_TAGNAME,
    exact: true,
    component: CreateTag,
    customHeader: true
  },
  {
    path: routesPath.ORDER_TXNS,
    exact: true,
    component: OrderList,
    customHeader: true
  },
  {
    path: routesPath.ORDER_STARTED,
    exact: true,
    component: StartedList,
    customHeader: true
  },
  {
    path: routesPath.ORDER_PICK_REVERSE,
    exact: true,
    component: ReversePickup,
    customHeader: true
  },
  {
    path: routesPath.ORDER_ASSIGN_REFUND,
    exact: true,
    component: AssignRefund,
    customHeader: true
  },
  {
    path: routesPath.ORDER_PROCESS_REFUND,
    exact: true,
    component: ProcessRefund,
    customHeader: true
  },
  {
    path: routesPath.ORDER_PENDING_REFUND,
    exact: true,
    component: PendingRefund,
    customHeader: true
  },
  {
    path: routesPath.ORDER_EXCHANGE_REPLACE,
    exact: true,
    component: ExchangeReplace,
    customHeader: true
  },
  {
    path: routesPath.ORDER_BULK_ORDER_CANCELLATION,
    exact: true,
    component: BulkOrderCancellation,
    customHeader: true
  },
  {
    path: routesPath.ORDER_VIEW_TXN_HISTORY,
    exact: true,
    component: ViewTransactionHistory,
    customHeader: true
  },
  {
    path: routesPath.ORDER_UNUSABLE_SHIPMENT,
    exact: true,
    component: UnusableShipment,
    customHeader: true
  },
  {
    path: routesPath.ORDER_TXN_STATUS_CHANGE,
    exact: true,
    component: TxnStatusChange,
    customHeader: true
  },
  {
    path: routesPath.ORDER_RETURN_EXCHANGE_SELF_SHIPS,
    exact: true,
    component: ReturnExchangeSelfShips,
    customHeader: true
  },
  {
    path: routesPath.ORDER_REVERT_FT_REFUND_STATUS,
    exact: true,
    component: RevertFTRefundStatus,
    customHeader: true
  },
  {
    path: routesPath.ORDER_DELIVERY_UPDATE,
    exact: true,
    component: DeliveryUpdate,
    customHeader: true
  },
  {
    path: routesPath.ORDER_RETURN_DELIVERED,
    exact: true,
    component: ReturnDelivered,
    customHeader: true
  },
  {
    path: routesPath.ORDER_USER_DETAILS,
    exact: true,
    component: UserDetails,
    customHeader: true
  },
  {
    path: routesPath.ORDER_CURRENT_STATUS,
    exact: true,
    component: CurrentStatus,
    customHeader: true
  },
  // {
  //   path: routesPath.ORDER_STATUS_UPDATE,
  //   exact: true,
  //   component: StatusUpdate,
  //   customHeader: true
  // },
  {
    path: routesPath.CALL_CENTER_SEARCH,
    exact: true,
    component: CallCenterSearch,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_USER_DETAIL_SEARCH,
    exact: true,
    component: UserDetailSearch,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_USER_CART,
    exact: true,
    component: UserCart,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_SEARCH_PINCODE,
    exact: true,
    component: SearchPincode,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_TRACK_ORDER,
    exact: true,
    component: TrackOrder,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_PAYMENT_DETAILS,
    exact: true,
    component: PaymentDetails,
    customHeader: true
  },
  {
    path: routesPath.CHANGE_PASSWORD,
    exact: true,
    component: ChangePassword,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_CART,
    exact: true,
    component: TempCart,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_RETURN_EXCHANGE,
    exact: true,
    component: ReturnExchange,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_RETURN_EXCHANGE_TYPE,
    exact: true,
    component: ReturnExchangeType,
    customHeader: true
  },
  {
    path: routesPath.CALL_CENTER_COURIER_RETURN_PINCODE,
    exact: true,
    component: CustomerPicodeCourier,
    customHeader: true
  },
  {
    path: routesPath.PRICING_UPLOAD_DISCOUNT,
    exact: true,
    component: UploadDiscount,
    customHeader: true
  },
  {
    path: routesPath.PRICING_SCHEDULED_PRICE,
    exact: true,
    component: PriceScheduler,
    customHeader: true
  },
  {
    path: routesPath.PRICING_GET_SKU_DETAIL,
    exact: true,
    component: GetSkuDetail,
    customHeader: true
  },
  {
    path: routesPath.PRICING_UPDATE_INVENTORY,
    exact: true,
    component: UpdateInventory,
    customHeader: true
  },
  {
    path: routesPath.PRICING_OVERRIDE_INVENTORY,
    exact: true,
    component: OverrideInventory,
    customHeader: true
  },
  {
    path: routesPath.LIST_GENERIC_PROMO,
    exact: true,
    component: ListGenericPromo,
    customHeader: true
  },
  {
    path: routesPath.CREATE_EDIT_GENERIC_PROMO,
    exact: true,
    component: AddGenericPromo,
    customHeader: true
  },
  {
    path: routesPath.LIST_USER_PROMO,
    exact: true,
    component: ListUserPromo,
    customHeader: true
  },
  {
    path: routesPath.CREATE_EDIT_USER_PROMO,
    exact: true,
    component: AddUserPromo,
    customHeader: true
  },
  {
    path: routesPath.LIST_PROMOTIONAL_PROMO,
    exact: true,
    component: ListPromotionalPromo,
    customHeader: true
  },
  {
    path: routesPath.CREATE_EDIT_PROMOTIONAL_PROMO,
    exact: true,
    component: AddPromotionalPromo,
    customHeader: true
  },
  {
    path: routesPath.LIST_BANKOFFER_PROMO,
    exact: true,
    component: ListBankOfferPromo,
    customHeader: true
  },
  {
    path: routesPath.LIST_BANKOFFERCACHE_PROMO,
    exact: true,
    component: ListBankOfferPromoCache,
    customHeader: true
  },
  {
    path: routesPath.CREATE_EDIT_BANKOFFER_PROMO,
    exact: true,
    component: AddBankOfferPromo,
    customHeader: true
  },
  {
    path: routesPath.CREATE_MULTIUSER_PROMOTIONAL_PROMO,
    exact: true,
    component: MultiUserPromo,
    customHeader: true
  },
  {
    path: routesPath.PROMO_LIST_ACTIVE,
    exact: true,
    component: PromoListActive,
    customHeader: true
  },
  {
    path: routesPath.SIZE_MAP,
    exact: true,
    component: SizeMap,
    customHeader: true
  },
  {
    path: routesPath.VIRTUAL_MERCHANDISE,
    exact: true,
    component: VMUploadCSVPage,
    customHeader: true
  },
  {
    path: routesPath.CMSADMIN_CREATE_MENU,
    exact: true,
    component: CreateMenu,
    customHeader: true
  },
  {
    path: routesPath.CMSADMIN_COPY_MENU,
    exact: true,
    component: CreateMenu,
    customHeader: true
  },
  {
    path: routesPath.CMSADMIN_EDIT_MENU,
    exact: true,
    component: CreateMenu,
    customHeader: true
  },
  {
    path: routesPath.CMSADMIN_LIST_MENU,
    exact: true,
    component: ListMenu,
    customHeader: true
  },
  {
    path: routesPath.CMSADMIN_FORCE_UPDATE,
    exact: true,
    component: ForceUpdate,
    customHeader: true
  },
  {
    path: routesPath.AUDIT_LOGS_INVENTORY,
    exact: true,
    component: Inventory,
    customHeader: true
  },
  {
    path: routesPath.AUDIT_LOGS_PRICING,
    exact: true,
    component: Pricing,
    customHeader: true
  },
  {
    path: routesPath.AUDIT_LOGS_PRICING_SCHEDULED,
    exact: true,
    component: PricingScheduled,
    customHeader: true
  },
  {
    path: routesPath.AUDIT_LOGS_PROMO,
    exact: true,
    component: Promo,
    customHeader: true
  },
  {
    path: routesPath.AUDIT_LOGS_TAGGING,
    exact: true,
    component: Tagging,
    customHeader: true
  },
  {
    path: routesPath.AUDIT_LOGS_PRODUCT,
    exact: true,
    component: Product,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_WIDGETS,
    exact: true,
    component: Widgets,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_ADD_WIDGET,
    exact: true,
    component: AddWidget,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_EDIT_WIDGET,
    exact: true,
    component: AddWidget,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_TEMPLATES_LIST,
    exact: true,
    component: Templates,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_TEMPLATES_ADD,
    exact: true,
    component: AddTemplate,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_TEMPLATES_EDIT,
    exact: true,
    component: AddTemplate,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_VERSION,
    exact: true,
    component: Version,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_LISTBANNER,
    exact: true,
    component: ListBanner,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_PAYMENTBANNER,
    exact: true,
    component: PaymentBanner,
    customHeader: true
  },
  {
    path: routesPath.BANNERCMS_CONFIG,
    exact: true,
    component: EditConfig,
    customHeader: true
  },
  {
    path: routesPath.PINCODE_CREATE,
    exact: true,
    component: CreatePincode,
    customHeader: true
  },
  {
    path: routesPath.ZONE_CREATE,
    exact: true,
    component: CreateZone,
    customHeader:true
  },
  {
    path: routesPath.PINCODE_SERVICABILITY,
    exact: true,
    component: pinCodeServicability,
    customHeader: true
  },

  {
    path: routesPath.PINCODE_LIST,
    exact: true,
    component: ListPincode,
    customHeader: true
  },
  {
    path: routesPath.ZONES_LIST,
    exact: true,
    component: ListZones,
    customHeader: true
  },
  {
    path: routesPath.COURIER_CREATE,
    exact: true,
    component: CreateCourier,
    customHeader:true
  },
  {
    path: routesPath.COURIER_LIST,
    exact: true,
    component: ListCourier,
    customHeader:true
  },
  {
    path: routesPath.VENDOR_CREATE_VENDOR,
    exact: true,
    component: CreateVendor,
    customHeader: true
  },
  {
    path: routesPath.VENDOR_LIST_VENDOR,
    exact: true,
    component: ListVendor,
    customHeader: true
  },
  {
    path: routesPath.REPORTING,
    exact: true,
    component: Reporting,
    customHeader: true
  },
  {
    path: routesPath.DSR,
    exact: true,
    component: s3Reports,
    customHeader: true
  },
];

import(/* webpackChunkName: "SignIn" */ "./containers/SignIn");