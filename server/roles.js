export const all_roles = {
  auditlogs: [
    {
      icon: "verified_user",
      permission_name: "auditlogs_inventory",
      name: "Inventory Logs",
      url: "/auditlogs/inventory",
    },
    {
      icon: "",
      permission_name: "auditlogs_pricing",
      name: "Pricing Logs",
      url: "/auditlogs/pricing"
    },
    {
      icon: "",
      permission_name: "auditlogs_pricing_scheduled",
      name: "Scheduled Pricing Logs",
      url: "/auditlogs/pricing/scheduled"
    },
    {
      icon: "",
      permission_name: "auditlogs_promo",
      name: "Promo Logs",
      url: "/auditlogs/promo"
    },
    {
      icon: "",
      permission_name: "auditlogs_tagging",
      name: "Tagging Logs",
      url: "/auditlogs/tagging"
    },
    {
      icon: "",
      permission_name: "auditlogs_product",
      name: "Product Logs",
      url: "/auditlogs/product"
    }
  ],
  asn: [
    { icon: "explore", permission_name: "asn_read", name: "ASN", url: "/asn/list" }
  ],
  cms: [{ icon: "phonelink_setup", permission_name: "cms_all", name: "CMS", url: "/cms" }],
  blog: [
    {
      icon: "receipt",
      permission_name: "blog_module_access",
      name: "The Edit",
      url: "/the-edit"
    },
  ],
  style_stories: [
    {
      icon: "amp_stories",
      permission_name: "style_stories_admin",
      name: "Admin Panel",
      url: "/style_stories/admin"
    }
  ],
  headermenu: [
    {
      icon: "menu",
      permission_name: "headermenu_create_access",
      name: "Create Menu",
      url: "/headermenu/create-menu",
    },
    {
      icon: "",
      permission_name: "headermenu_list_access",
      name: "List Menu",
      url: "/headermenu/list-menu"
    },
    {
      icon: "",
      permission_name: "headermenu_force_update_access",
      name: "Force Update",
      url: "/headermenu/force-update"
    }
  ],
  bannercms: [
    {
      icon: "settings",
      permission_name: "bannercms_widgets_access",
      name: "Widgets",
      url: "/bannercms/widgets",
    },
    {
      icon: "",
      permission_name: "bannercms_templates_access",
      name: "Templates",
      url: "/bannercms/templates"
    },
    // {
    //   icon: "",
    //   permission_name: "bannercms_templates_create_access",
    //   name: "Create Template",
    //   url: "/bannercms/templates/add"
    // },
    {
      icon: "",
      permission_name: "bannercms_version_access",
      name: "Version Change",
      url: "/bannercms/version"
    },
    {
      icon: "",
      permission_name: "bannercms_listbanner_access",
      name: "List Banner",
      url: "/bannercms/listbanner"
    },
    {
      icon: "",
      permission_name: "bannercms_paymentbanner_access",
      name: "Payment Banner",
      url: "/bannercms/paymentbanner"
    },
    {
      icon: "",
      permission_name: "bannercms_config_access",
      name: "Edit Config",
      url: "/bannercms/config"
    }
  ],
  cat: [
    {
      icon: "category",
      permission_name: "cat_brand_read",
      name: "Brands",
      url: "/catalogue/list/brand",
    },
    {
      icon: "",
      permission_name: "cat_parent_read",
      name: "Master Category",
      url: "/catalogue/list/parent/category"
    },
    {
      icon: "",
      permission_name: "cat_attribute_read",
      name: "Attribute",
      url: "/catalogue/list/attribute"
    },
    {
      icon: "",
      permission_name: "cat_product_read",
      name: "List Products",
      url: "/catalogue/list/product"
    },
    {
      icon: "",
      permission_name: "cat_batch_add_read",
      name: "Batch Add Products",
      url: "/catalogue/batchadd/product"
    },
    {
      icon: "",
      permission_name: "cat_batch_update_read",
      name: "Batch Update Products",
      url: "/catalogue/batchupdate/product"
    },
    {
      icon: "",
      permission_name: "cat_batch_dsku_read",
      name: "Download SKU's",
      url: "/catalogue/batchdownload/sku"
    },
    {
      icon: "",
      permission_name: "cat_batch_linestatusupdate_read",
      name: "Batch Line Status",
      url: "/catalogue/batchlinestatuschange"
    },
    {
      icon: "",
      permission_name: "cat_product-image_read",
      name: "Line Images",
      url: "/catalogue/product-image"
    },
    {
      icon: "",
      permission_name: "cat_measurement_read",
      name: "Model",
      url: "/catalogue/list/measurement"
    },
    {
      icon: "",
      permission_name: "cat_mapmeasurement_read",
      name: "Map Measurement",
      url: "/catalogue/product-measurement/"
    },
    {
      icon: "",
      permission_name: "cat_skustatus_read",
      name: "Sku Status Change",
      url: "/catalogue/sku"
    },
    {
      icon: "",
      permission_name: "cat_addcolorcode_read",
      name: "Add Color Code",
      url: "/catalogue/add-color-code"
    },
    {
      icon: "",
      permission_name: "cat_mapcolorcode_read",
      name: "Map Color Code",
      url: "/catalogue/map-color-code"
    },
    {
      icon: "",
      permission_name: "cat_seo_all",
      name: "SEO Data",
      url: "/catalogue/list/banner"
    },
    {
      icon: "",
      permission_name: "cat_productindex_all",
      name: "Index Product",
      url: "/catalogue/indexproduct"
    },
    {
      icon: "",
      permission_name: "cat_hsn_mapping",
      name: "HSN Mapping",
      url: "/catalogue/hsn"
    }
  ],
  sizemap: [
    {
      icon: "crop_free",
      permission_name: "sizemap_access",
      name: "Size Map Template",
      url: "/sizemap/size-map-template",
    }
  ],
  role: [
    {
      icon: "assignment_ind",
      permission_name: "cat_brand_read",
      name: "Role",
      url: "/role/list/roles",
    },
    {
      icon: "",
      permission_name: "cat_brand_read",
      name: "Assign Roles",
      url: "/role/assign/roles"
    }
  ],
  tagging: [
    {
      icon: "local_offer",
      permission_name: "tag_read",
      name: "All Tags",
      url: "/tagging/list",
    },
    {
      icon: "",
      permission_name: "tag_mapping_access",
      name: "Tag Mapping",
      url: "/tagging/mapping"
    },
    {
      icon: "",
      permission_name: "tag_remove_access",
      name: "Tag Remove",
      url: "/tagging/remove"
    }
  ],
  order: [
    {
      icon: "bookmark_border",
      permission_name: "order_deliveryreturn_read",
      name: "Return Delivered",
      url: "/order/returndelivered",
    },
    {
      icon: "",
      permission_name: "order_details_read",
      name: "Order Details",
      url: "/order/txns"
    },
    {
      icon: "",
      permission_name: "order_startedorder_read",
      name: "Started/ Failed Orders",
      url: "/order/started"
    },
    {
      icon: "",
      permission_name: "order_reverseorder_read",
      name: "Reverse Pickup",
      url: "/order/pick/reverse"
    },
    {
      icon: "",
      permission_name: "order_assignrefund_read",
      name: "Assign Refund",
      url: "/order/assignRefund"
    },
    {
      icon: "",
      permission_name: "order_exchangeapproval_read",
      name: "Exchange Approval and Cancellation",
      url: "/order/exchng_repl"
    },
    {
      icon: "",
      permission_name: "order_bulkordercancellation_read",
      name: "Bulk Order Cancellation",
      url: "/order/bulkordercancellation"
    },
    {
      icon: "",
      permission_name: "order_unusable_shipment_read",
      name: "Unusable Shipments",
      url: "/order/unusable_shipment"
    },
    {
      icon: "",
      permission_name: "order_delivery_update_read",
      name: "Delivery Update",
      url: "/order/deliveryUpdate"
    },
    {
      icon: "",
      permission_name: "order_history_read",
      name: "Order Transaction History",
      url: "/order/viewTxnHistory"
    },
    {
      icon: "",
      permission_name: "order_process_refund_read",
      name: "Process Refund",
      url: "/order/processrefund"
    },
    {
      icon: "",
      permission_name: "order_pending_refund_read",
      name: "Pending Refund",
      url: "/order/pendingrefund"
    },
    {
      icon: "",
      permission_name: "order_txn_status_change_read",
      name: "Txn Status Change",
      url: "/order/txn_status_change"
    },
    {
      icon: "",
      permission_name: "order_return_exchange_selfship_read",
      name: "Return Exchange Self Ship",
      url: "/order/returnExchangeSelfShip"
    },
    {
      icon: "",
      permission_name: "order_revert_ft_refund_status_read",
      name: "Revert Refund",
      url: "/order/revertFTRefundStatus"
    },
    {
      icon: "",
      permission_name: "order_user_details",
      name: "User Details",
      url: "/order/userdetails"
    },
    {
      icon: "",
      permission_name: "order_current_status",
      name: "Current Status",
      url: "/order/currentstatus"
    }
  ],
  customer: [
    {
      icon: "group",
      permission_name: "customer_search_read",
      name: "Search User",
      url: "/call_center/search",
    },
    {
      icon: "",
      permission_name: "customer_searchpincode_read",
      name: "Search Pincode",
      url: "/call_center/searchPincode"
    },
    {
      icon: "",
      permission_name: "customer_trackorder_access",
      name: "Track Order",
      url: "/call_center/track_order"
    },
    {
      icon: "",
      permission_name: "customer_cartdata_read",
      name: "Temp Cart Data",
      url: "/call_center/cart"
    },
    {
      icon: "",
      permission_name: "customer_returnexchange_read",
      name: "Return Exchange",
      url: "/call_center/return_exchange"
    },
    {
      icon: "",
      permission_name: "customer_paymentdetails_access",
      name: "Order Payment Details",
      url: "/call_center/payment_details"
    },
    {
      icon: "",
      permission_name: "customer_usercart_access",
      name: "Customer Cart Login",
      url: "/call_center/userCart"
    },
    {
      icon: "",
      permission_name: "customer_picode_courier_access",
      name: "Courier Return Pincode Servicablity",
      url: "/call_center/courier-return-pincode"
    }
  ],
  price: [
    {
      icon: "payments",
      permission_name: "price_priceschedulerdash_access",
      name: "Pricing Detail",
      url: "/price/priceSchedulerDashboard",
    },
    {
      icon: "",
      permission_name: "price_uploaddiscount_access",
      name: "Upload Discount",
      url: "/price/uploaddiscount"
    },
    {
      icon: "",
      permission_name: "price_getskudetail_access",
      name: "Get Sku Detail",
      url: "/price/getSkuDetail"
    },
    {
      icon: "",
      permission_name: "price_updateinventory_access",
      name: "Update Inventory",
      url: "/price/updateInventory"
    },
    {
      icon: "",
      permission_name: "price_overrideinventory_access",
      name: "Override Inventory",
      url: "/price/overrideInventory"
    }
  ],
  lsp: [
    {
      icon: "my_location",
      permission_name: "lsp_courier_service_access",
      name: "Courier List",
      url: "/lsp/courier/list/all",
    },
    {
      icon: "",
      permission_name: "lsp_pincode_list_access",
      name: "Pincode List",
      url: "/lsp/pincode/list/all"
    },
    {
      icon: "",
      permission_name: "lsp_customer_picode_servicability",
      name: "Pincode Servicability",
      url: "/lsp/pincodeServicability/list/all"
    },
    {
      icon: "",
      permission_name: "lsp_zone_list_access",
      name: "Zone",
      url: "/lsp/zones/list/all"
    }
  ],
  promo: [
    {
      icon: "local_offer",
      permission_name: "promo_generic_read",
      name: "Generic Promo",
      url: "/promo/list/generic",
    },
    {
      icon: "",
      permission_name: "promo_user_read",
      name: "User Promo",
      url: "/promo/list/user"
    },
    {
      icon: "",
      permission_name: "promo_promotional_read",
      name: "Promotional Promo",
      url: "/promo/list/promotional"
    },
    {
      icon: "",
      permission_name: "promo_activepromo_access",
      name: "Create Promo List",
      url: "/promo/list/active"
    },
    {
      icon: "",
      permission_name: "promo_multiuser_access",
      name: "Multi User Promo",
      url: "/promo/multiuser/create"
    },
    {
      icon: "",
      permission_name: "promo_bankoffer_access",
      name: "Bank Offer Promo",
      url: "/promo/list/bankoffer"
    },
    {
      icon: "",
      permission_name: "promo_bankoffercache_access",
      name: "Bank Offer Cache",
      url: "/promo/list/bankoffercache"
    }
  ],
  vm: [
    {
      icon: "show_chart",
      permission_name: "vm_upload_access",
      name: "Upload CSV",
      url: "/virtual-merchandise/upload-csv",
    }
  ],
  shopthelook: [
    {
      icon: "storefront",
      permission_name: "shopthelook_create_access",
      name: "Create",
      url: "/shopthelook/create",
    },
    {
      icon: "",
      permission_name: "shopthelook_list_access",
      name: "List",
      url: "/shopthelook/list"
    }
  ],
  navsync: [
    {
      icon: "local_offer",
      permission_name: "navsync_screen_access",
      name: "Create",
      url: "/navsync/screen",
      iconName:"fullscreen"
    }
  ],
  // sap: [
  //   {
  //     icon: "",
  //     permission_name: "sap_mgmt_access",
  //     name: "SAP Management",
  //     url: "/sap/sapmanagement"
  //   }
  // ],
  referral: [
    {
      icon: "mobile_friendly",
      permission_name: "referral_list_access",
      name: "List",
      url: "/referral_program/ref/list/all",
    },
  ],
  payment: [
    {
      icon: "attach_money",
      permission_name: "payment_list_access",
      name: "Payment Options",
      url: "/payment/options/list/all"
    },
  ],
  vendor: [
    {
      icon: "bubble_chart",
      permission_name: "vendor_list_access",
      name: "List Vendor",
      url: "/vendor/list/all"
    },
  ],
  reporting: [
    {
      icon: "pages",
      permission_name: "reporting_notshipped_access",
      name: "Not Shipped Txn",
      url: "/reporting/download/notshipped"
    },
    {
      icon: "",
      permission_name: "reporting_return_access",
      name: "Return",
      url: "/reporting/download/return"
    },
    {
      icon: "",
      permission_name: "reporting_refund_access",
      name: "Refund Pending",
      url: "/reporting/download/refundpending"
    },
    {
      icon: "",
      permission_name: "reporting_sale_access",
      name: "Sale",
      url: "/reporting/download/sale"
    },
    // {
    //   icon: "",
    //   permission_name: "reporting_lineid_access",
    //   name: "Line ID",
    //   url: "/reporting/download/lineid"
    // },
    {
      icon: "",
      permission_name: "reporting_stock_access",
      name: "Stock",
      url: "/reporting/download/stock"
    },
    {
      icon: "mobile_friendly",
      icon: "",
      permission_name: "reporting_grn_access",
      name: "GRN",
      url: "/reporting/download/grn"
    },
    {
      icon: "",
      permission_name: "reporting_dsr_access",
      name: "Daily",
      url: "/reporting/daily-scheduled-reports"
    }
  ],
};
