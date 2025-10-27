(function () {
    const Templator = {
        reloadSelect: function () {
            let templates = JSON.parse(window.localStorage.getItem('ttt_templates'));
            templates = templates ? templates : {};
            let html = '<option value=""></option>';
            for (const template in templates) {
                if (templates[template]) {
                    html += '<option value="' + template + '">' + template + '</option>';
                }
            }
            document.querySelector('#ttt_templates').innerHTML = html;
        },

        getRepeaterValue: function(containerClass) {
            const container = document.querySelector('.' + containerClass);
            const inputGroups = container.querySelectorAll('.ttt_inputs_block');
            const output = [];

            inputGroups.forEach(group => {
                const out = {}
                const inputs = group.querySelectorAll('input')
                inputs.forEach(input => {
                    out[input.name] = input.value
                });
                output.push(out);
            });
            return output
        },

        getRadio: function(name) {
            const inputs = document.querySelectorAll(`[name=${name}]`)
            let out = 0;
            inputs.forEach(input => {
                if (input.checked) {
                    out = input.value
                }
            })
            return out
        },

        getArray: function(name) {
            let output = []
            document.querySelectorAll(`[name=${name}]`).forEach(input => {
                if (input.checked) {
                    let out = input.value.split('-')
                    output.push(out)
                }
            })
            return output
        },
        getSelectCountry: function getSelectCountry(select) {
            var result = [];
            var options = select && select.options;
            var opt;

            for (var i=0, iLen=options.length; i<iLen; i++) {
                opt = options[i];

                if (opt.selected) {
                    result.push(opt.value || opt.text);
                }
            }
            return result;
        },

        serialiseAutozaliv: function() {
            const formObj = {}
            const inputs = document.querySelector('.ttt_autozaliv_form').querySelectorAll('.ttt_input_field')

            inputs.forEach(el => {
                if (el.name.startsWith('ttt')) {
                    formObj[el.name] = el.value
                }
            });

            const blocked = ['ttt_bids', 'ttt_videos', 'ttt_titles']
            blocked.forEach(name => {
                formObj[name] = this.getRepeaterValue(name)
            })
            const arrayed_country = ['ttt_country']
            arrayed_country.forEach(name => {
                formObj[name] = this.getSelectCountry(document.querySelectorAll(`[name=${name}]`)[0])
            })
            const arrayed = ['ttt_age']
            arrayed.forEach(name => {
                formObj[name] = this.getArray(name)
            })

            const radio = ['ttt_countInAdset', 'ttt_gender', 'tttt_stavka']
            radio.forEach(name => {
                formObj[name] = this.getRadio(name)
            })

            return formObj;
        }
    }
    function getValue(name, array = false) {
        const inputs = document.querySelectorAll(`[name=${name}]`)
        if (array) {
            const output = []
            inputs.forEach(input => {
                output.push(input.value.trim())
            });
            return output
        } else {
            return inputs[0].value.trim()
        }
    }
    function getRadio(name) {
        const inputs = document.querySelectorAll(`[name=${name}]`)
        let out = 0;
        inputs.forEach(input => {
            if (input.checked) {
                out = input.value.trim()
            }
        })
        return out
    }
    function getAges() {
        let output = []

        // Перевіряємо, чи вибрано "Всі"
        const allAgesChecked = document.querySelector('[name=ttt_age][value="All"]').checked;
        if (allAgesChecked) {
            return []; // Повертаємо пустий масив, якщо вибрано "Всі"
        }

        // Якщо "Всі" не вибрано, збираємо вікові групи
        document.querySelectorAll('[name=ttt_age]').forEach(input => {
            if (input.checked && input.value !== "All") {
                let out = input.value.trim().split('-')
                output.push(out)
            }
        })
        return output
    }
    function getSelectCountry(select) {
        if (!select) return [];

        const result = [];
        const options = select.options;

        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            if (opt.selected) {
                // беремо value або text
                let val = opt.value || opt.text;
                // пробуємо привести до числа
                if (!isNaN(val)) {
                    val = parseInt(val, 10);
                }
                result.push(val);
            }
        }

        return result;
    }
    function getRepeaterValue(containerClass) {
        const container = document.querySelector('.' + containerClass)
        const inputGroups = container.querySelectorAll('.ttt_inputs_block')
        const output = []

        inputGroups.forEach(group => {
            const out = {}
            const inputs = group.querySelectorAll('input')
            inputs.forEach(input => {
                out[input.name] = input.value.trim()
            });
            output.push(out)
        });
        return output
    }

    // helper for safe fetch + json parsing with error handling
    async function safeFetchJson(url, options = {}) {
        try {
            const res = await fetch(url, options);
            // if response is not JSON, this will throw and be caught below
            return await res.json();
        } catch (e) {
            console.error('[safeFetchJson] fetch/json error for', url, e);
            return null;
        }
    }

    // small helpers exposed globally
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    window.sleep = sleep;

    // safe JSON parse/stringify helpers
    function safeParse(json, fallback = null) {
        try { return JSON.parse(json); } catch (e) { return fallback; }
    }

    function safeStringify(obj) {
        try { return JSON.stringify(obj); } catch (e) { return '{}'; }
    }

    //https://ads.tiktok.com/api/v4/i18n/creation/spark/identity/select/?aadvid=7550052920746721296&req_src=ad_creation&msToken=
    // {
    //     "cursor": "0",
    //     "page": 1,
    //     "limit": 20,
    //     "keywords": "",
    //     "is_query_dm_ban": false,
    //     "specific_options": {
    //     "objective_type": 3,
    //         "external_type": 102
    // },
    //     "mix_mode": 1,
    //     "identity_query_mode": 8
    // }
    // {
    //     "has_more": false,
    //     "cursor": "3",
    //     "next_page": 2,
    //     "next_query_mode": 1,
    //     "identity_list": [
    //     {
    //         "identity_type": 3,
    //         "identity_id": "3f76ce09-fd2b-5947-8b40-1c3fcd85f413",
    //         "display_name": "Sedric360",
    //         "avatar_icon": {
    //             "height": 100,
    //             "width": 100,
    //             "url": "https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1594805258216454~tplv-tiktokx-cropcenter:100:100.jpeg?dr=14579&refresh_token=ccae2f41&x-expires=1761674400&x-signature=AhhvAXWgK%2Fh%2FTPSEZ2PWcDJClCU%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=8aecc5ac&idc=maliva",
    //             "web_uri": ""
    //         },
    //         "available_status": 0,
    //         "can_manage_video": true,
    //         "can_use_live_list": true,
    //         "can_use_video_list": true,
    //         "can_use_showcase": true,
    //         "can_use_direct_message": true,
    //         "can_send_direct_message": false,
    //         "can_manage_direct_message": true,
    //         "can_use_series_collection": true,
    //         "available_quota": 195694,
    //         "total_quota": 200000,
    //         "used_quota": 4306,
    //         "account_type": 1,
    //         "can_use_tag_ba_video_list": true,
    //         "username": "sedric360",
    //         "is_dm_ban": false,
    //         "is_ccoc_ban": false,
    //         "is_gpppa_account": false,
    //         "can_edit_post": true
    //     },
    //     {
    //         "identity_type": 1,
    //         "identity_id": "7085320261789483010",
    //         "display_name": "local",
    //         "avatar_icon": {
    //             "height": 0,
    //             "width": 0,
    //             "url": "",
    //             "web_uri": ""
    //         },
    //         "available_status": 0,
    //         "can_manage_video": false,
    //         "can_use_live_list": false,
    //         "can_use_video_list": true,
    //         "can_use_direct_message": false,
    //         "can_use_series_collection": false,
    //         "is_ccoc_ban": false,
    //         "is_gpppa_account": false,
    //         "can_edit_post": false
    //     },
    //     {
    //         "identity_type": 1,
    //         "identity_id": "7239331032117297153",
    //         "display_name": "Castom",
    //         "avatar_icon": {
    //             "height": 0,
    //             "width": 0,
    //             "url": "",
    //             "web_uri": ""
    //         },
    //         "available_status": 0,
    //         "can_manage_video": false,
    //         "can_use_live_list": false,
    //         "can_use_video_list": true,
    //         "can_use_direct_message": false,
    //         "can_use_series_collection": false,
    //         "is_ccoc_ban": false,
    //         "is_gpppa_account": false,
    //         "can_edit_post": false
    //     },
    //     {
    //         "identity_type": 1,
    //         "identity_id": "7027871234009464834",
    //         "display_name": "Learn more",
    //         "avatar_icon": {
    //             "height": 0,
    //             "width": 0,
    //             "url": "",
    //             "web_uri": ""
    //         },
    //         "available_status": 0,
    //         "can_manage_video": false,
    //         "can_use_live_list": false,
    //         "can_use_video_list": true,
    //         "can_use_direct_message": false,
    //         "can_use_series_collection": false,
    //         "is_ccoc_ban": false,
    //         "is_gpppa_account": false,
    //         "can_edit_post": false
    //     }
    // ]
    // }



    var accountID = document.URL.slice(document.URL.indexOf('aadvid=') + 7);
    var csrfToken = document.cookie.slice(document.cookie.indexOf('csrftoken=')).split(';')[0].split('=')[1];
    let pixelId, iconId, subid3, countInAdset, country, gender, age, budget, titles, pixName, allVideos;
    let pixToken = '1';
    let pixelList={};
    async function getPixel() {
        const res = await safeFetchJson(`https://ads.tiktok.com/api/v2/i18n/pixel/list/?aadvid=${accountID}&req_src=ad_creation&promotion_website_type=0&objective_type=3`);
        if (!res || !res.data || !res.data.pixel_list) return;
        const pixel_list = document.getElementById("ttt_pixel");
        for (let i = 0; i < res.data.pixel_list.length; i++) {
            console.log(res.data.pixel_list[i].pixel_name);
            const opt = document.createElement('option');
            opt.value = res.data.pixel_list[i].pixel_id;
            opt.innerHTML = res.data.pixel_list[i].pixel_name;
            pixel_list.appendChild(opt);
            pixelList[res.data.pixel_list[i].pixel_id] = res.data.pixel_list[i].pixel_code;
        }
    }
    async function avtozaliv() {
        document.querySelector('.ttt_start_autozaliv').classList.add('w3-red')
        document.querySelector('.ttt_start_autozaliv').classList.remove('w3-blue')
        pixelId = getValue('ttt_pixel')
        pixName = pixelList[pixelId]
        console.log(pixName)
        if (!pixelId) {
            alert('Не создан пиксель');
            return;
        } else {
            console.log('Pixel ID: ', pixelId);
        }

        // await fetch(`https://ads.tiktok.com/i18n/events_manager/api/graphql?aadvid=${accountID}`, {
        //     "headers": {
        //         "content-type": "application/json",
        //     },
        //     "body": "{\"operationName\":\"getPixelSettingDeveloperToken\",\"variables\":{\"where\":{\"pixelCode\":\"" + pixName + "\",\"appID\":\"\"}},\"query\":\"query getPixelSettingDeveloperToken($where: SettingTokenInput) {\\n  getPixelSettingDeveloperToken(where: $where) {\\n    token\\n    status\\n    errMessage\\n    __typename\\n  }\\n}\\n\"}",
        //     "method": "POST",
        // })
        //     .then(res => res.json())
        //     .then(res => {
        //         //console.log(res.data)
        //         if (res.data.getPixelSettingDeveloperToken.token) {
        //             pixToken = res.data.getPixelSettingDeveloperToken.token;
        //         } else if(res.data.getPixelSettingDeveloperToken.errMessage === "NO_PERMISSION") {
        //             pixToken=""
        //         }else {
        //             console.log(cabName, ': Ошибка токена пикселя');
        //         }
        //     });
        // console.log('Token pix:', pixToken);




        allVideos = await getVideos();
        if (allVideos.length === 0) {
            alert("Загрузите видео в кабинет");
            return;
        }

        try {
            let todayDate = `${new Date().getDate() < 10 ? '0' + (new Date().getDate()) : (new Date().getDate())}${new Date().getMonth() < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)}`;

            const cabRes = await safeFetchJson(`https://ads.tiktok.com/api/v3/i18n/account/permission/detail/?aadvid=${accountID}`);
            let cabName = (cabRes && cabRes.data && cabRes.data.account && cabRes.data.account.name) ? cabRes.data.account.name.replaceAll('_', '') : '';

            //subid3 = getValue('ttt_subid3'); // subid 3
            let offerName = getValue('ttt_offerName'); // Названние оффера
            let BIP = '[' + getValue('ttt_BIP') + ']';
            let bids = getRepeaterValue('ttt_bids');
            let videosNames = getRepeaterValue('ttt_videos');
            let offerMainLink = getValue('ttt_offerMainLink'); // Ссылка на оффер
            let adsCreoCount = Number(getValue('ttt_ads_double')) ? Number(getValue('ttt_ads_double')) : 1; // Сколько адсетов на крео
            countInAdset = Number(getValue('ttt_ads_count')) ? Number(getValue('ttt_ads_count')) : 1; // 1 або 2: 1 - 1 крео 5 описів 1 кнопка (5адсов); 2 - 2 крео 5 оп 1 кн (10 адсов)
            country = getSelectCountry(document.querySelectorAll(`[name=ttt_country]`)[0]);
            gender = Number(getRadio('ttt_gender')); // 0 - все,1 - мужчины, 2- женщины
            stavka = Number(getRadio("tttt_stavka"));
            age = getAges(); // Возраста ОТ і ДО
            budget = getValue('ttt_budget'); // Бюджет
            // pixelToken = getValue('ttt_pix_token') ? getValue('ttt_pix_token') : 1; // Токен
            iconURL = getValue('ttt_iconURL'); // Иконка
            iconName = getValue('ttt_iconName'); // Имя иконки
            titles = getRepeaterValue('ttt_titles') // Заголовки
            button_video = getValue('ttt_button')
            let smartComp = document.querySelector("#ttt_smart").checked
            let CompaniInfo

            if (iconURL === '1') {
                iconURL = '';
            }


            // await fetch(`https://ads.tiktok.com/api/v3/i18n/identity/save/?aadvid=${accountID}&req_src=ad_creation`, {
            const identityRes = await safeFetchJson(`https://ads.tiktok.com/api/v3/i18n/identity/save/?aadvid=${accountID}&req_src=ad_creation`, {
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                body: JSON.stringify({ display_name: iconName, profile_image: iconURL, identity_type: 1 }),
                method: "POST",
            });
            if (identityRes && identityRes.data && identityRes.data.identity_info) {
                iconId = identityRes.data.identity_info.identity_id;
            }

            if (!iconId) {
                alert('Что-то не то с иконкой');
                return;
            } else {
                console.log('Pixel ID: ', pixelId);
            }


            if (pixelId && iconId) {
                for (let i = 0; i < videosNames.length; i++) {
                    const videoArray = videosNames[i];
                    videoArray.prefix = videoArray.video_name.split('_')[0];

                    for (let j = 0; j < bids.length; j++) {
                        const arrBid = bids[j];

                        arrBid.bid_summ = String(arrBid.bid_summ).replace(',', '.')

                        await sleep(5000);

                        let bidStr = arrBid.bid_summ;
                        let campaignName = `${todayDate}_${videoArray.prefix}_${offerName}_${bidStr}`;
                        let campaignId = null;
                        try {
                            const risk_info_campaign = {
                                cookie_enabled: navigator.cookieEnabled,
                                screen_width: window.screen.width || 1920,
                                screen_height: window.screen.height || 1080,
                                browser_language: navigator.language || 'en-US',
                                browser_platform: navigator.platform || 'Web',
                                browser_name: navigator.appName || 'Mozilla',
                                browser_version: navigator.userAgent || '',
                                browser_online: navigator.onLine,
                                timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
                            };

                            const newCampaignDataJSON = {
                                campaign_sketch_form_data: {
                                    spc_upgrade_mode: 1,
                                    spc_multi_ad_mode: 0,
                                    industry_types: [],
                                    campaign_app_profile_page_type: 0,
                                    onelink_type: 0,
                                    onelink_url: "",
                                    lead_catalog_toggle: 0,
                                    po_number: "",
                                    virtual_objective_type: 1,
                                    sales_destination: 3,
                                    virtual_isolated: { _a_o_s: { validate_result: {} } },
                                    app_id: "",
                                    dedicate_type: 1,
                                    bid_align_type: 0,
                                    skan4_campaign_structure_type: 0,
                                    rewarding_game_attestation: 0,
                                    universal_type_default_on: true,
                                    universal_type: 1,
                                    search_campaign_type: 0,
                                    budget: budget || "",
                                    budget_mode: (budget && String(budget).trim() !== '') ? 3 : -1,
                                    budget_optimize_switch: 1,
                                    cbo_uniform_bid: 0,
                                    ab_test: 0,
                                    split_test_flag: 0,
                                    campaign_name: campaignName,
                                    campaign_snap_id: "",
                                    campaign_sketch_id: "",
                                    buying_type: 1,
                                    objective_type: 3,
                                    redesign_campaign_type: 1,
                                    app_campaign_type: 0,
                                    ba_campaign_type: 0,
                                    rta_id: "",
                                    rta_product_selection_type: 0,
                                    rta_bid_type: 0,
                                    web_all_in_one_catalog: 0,
                                    has_selected_traffic_smart_plus: false,
                                    support_traffic_smart_plus: true,
                                    promotion_scenario: 0,
                                    brand_campaign_type: 4,
                                    ecomm_type: 0,
                                    auto_creation_product_type: 1,
                                    spc_automation_type: 1,
                                    bid: "",
                                    cpa_bid: ""
                                },
                                clear_lower_level_sketches: false,
                                with_sketch: true,
                                is_skip_check_fields: true,
                                risk_info: risk_info_campaign
                            };

                            const campRes = await safeFetchJson(`https://ads.tiktok.com/api/v4/i18n/creation/campaign_snap/save/?aadvid=${accountID}&req_src=ad_creation`, {
                                headers: { 'content-type': 'application/json;charset=UTF-8', 'x-csrftoken': `${csrfToken}` },
                                body: JSON.stringify(newCampaignDataJSON),
                                method: 'POST'
                            });

                            if (campRes && campRes.data) {
                                // prefer campaign_snap_id or campaign_id if provided
                                campaignId = campRes.data.campaign_id || campRes.data.campaign_snap_id || null;
                                CompaniInfo = campRes.data
                                console.log("Compaine SAVE")
                                console.log(campRes);

                            }
                        } catch (e) {
                            console.error('create campaign error:', e);
                        }

                        console.log('Campaign ID: ', campaignId);
                        console.log("Campaing Name: ", campaignName);

                        if (campaignId) {

                            for (let i = 1; i <= Number(videoArray.count); i += countInAdset) {

                                for (let l = 0; l < adsCreoCount; l++) {

                                    let sub2 = `${cabName}_${bidStr.replace('.', '')}_${videoArray.prefix}_${offerName}_${l}`;

                                    let adset_name = l === 0 ? `${videoArray.prefix}_${offerName}_CP_!!! ${BIP}` : `${videoArray.prefix}_${offerName}_CP_!!! ${BIP} - ${l}`
                                    await sleep(5000);
                                    let adsetOption = {
                                        'i': i,
                                        'adsetName': adset_name,
                                        'campaignId': campaignId,
                                        'bid': arrBid.bid_summ,
                                        'url': `${offerMainLink}`,//?external_id=__CAMPAIGN_NAME__&creative_id=__CID_NAME__&__CID__&ad_campaign_id=__CAMPAIGN_ID__&subid2=${sub2}_CP_!!!&subid3=${subid3}&sub_id_5=__AID__&ttclid=__CLICKID__&pixel=${pixName}&event=CompletePayment,AddToCart,PlaceAnOrder&ttoken=${pixToken}&t1=PIXEL_ID&t2=__AID_NAME__&t3=__CID_NAME__&t4=__CALLBACK_PARAM__`,
                                        'videoName': videoArray.video_name,

                                        // 'pixelId': pixelId,
                                        // 'iconId': iconId,
                                    }

                                    createAdset_plug(adsetOption, CompaniInfo);
                                }
                            }
                        }
                    }

                }
            }
            alert('Все готово!')
            document.querySelector('.ttt_start_autozaliv').classList.add('w3-blue')
            document.querySelector('.ttt_start_autozaliv').classList.remove('w3-red')
        }catch (e) {
            console.log(e)
        }
    }
    let timezone
    async function getzone() {
        const res = await safeFetchJson(`https://ads.tiktok.com/api/v4/i18n/account/permission/detail/?aadvid=${accountID}`, {
            headers: { "x-csrftoken": `${csrfToken}` },
            method: 'GET'
        });
        return (res && res.data && res.data.account) ? res.data.account.timezone : undefined;
    }

    async function createCampaign_plug(_campaignName) {
        // Create campaign using the sample payload structure from ав.json
        let campignid = null;
        try {
            // Build risk_info similar to the sample
            const risk_info_campaign = {
                cookie_enabled: navigator.cookieEnabled,
                screen_width: window.screen.width || 1920,
                screen_height: window.screen.height || 1080,
                browser_language: navigator.language || 'en-US',
                browser_platform: navigator.platform || 'Web',
                browser_name: navigator.appName || 'Mozilla',
                browser_version: navigator.userAgent || '',
                browser_online: navigator.onLine,
                timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
            };

            const newCampaignDataJSON = {
                campaign_sketch_form_data: {
                    spc_upgrade_mode: 1,
                    spc_multi_ad_mode: 0,
                    industry_types: [],
                    campaign_app_profile_page_type: 0,
                    onelink_type: 0,
                    onelink_url: "",
                    lead_catalog_toggle: 0,
                    po_number: "",
                    virtual_objective_type: 1,
                    sales_destination: 3,
                    virtual_isolated: { _a_o_s: { validate_result: {} } },
                    app_id: "",
                    dedicate_type: 1,
                    bid_align_type: 0,
                    skan4_campaign_structure_type: 0,
                    rewarding_game_attestation: 0,
                    universal_type_default_on: true,
                    universal_type: 1,
                    search_campaign_type: 0,
                    budget: budget || "",
                    budget_mode: (budget && String(budget).trim() !== '') ? 3 : -1,
                    budget_optimize_switch: 1,
                    cbo_uniform_bid: 0,
                    ab_test: 0,
                    split_test_flag: 0,
                    campaign_name: _campaignName,
                    campaign_snap_id: "",
                    campaign_sketch_id: "",
                    buying_type: 1,
                    objective_type: 3,
                    redesign_campaign_type: 1,
                    app_campaign_type: 0,
                    ba_campaign_type: 0,
                    rta_id: "",
                    rta_product_selection_type: 0,
                    rta_bid_type: 0,
                    web_all_in_one_catalog: 0,
                    has_selected_traffic_smart_plus: false,
                    support_traffic_smart_plus: true,
                    promotion_scenario: 0,
                    brand_campaign_type: 4,
                    ecomm_type: 0,
                    auto_creation_product_type: 1,
                    spc_automation_type: 1,
                    bid: "",
                    cpa_bid: ""
                },
                clear_lower_level_sketches: false,
                with_sketch: true,
                is_skip_check_fields: true,
                risk_info: risk_info_campaign
            };

            const campRes = await safeFetchJson(`https://ads.tiktok.com/api/v4/i18n/creation/campaign_snap/save/?aadvid=${accountID}&req_src=ad_creation`, {
                headers: { 'content-type': 'application/json;charset=UTF-8', 'x-csrftoken': `${csrfToken}` },
                body: JSON.stringify(newCampaignDataJSON),
                method: 'POST'
            });

            if (campRes && campRes.data) {
                // prefer campaign_snap_id or campaign_id if provided
                campignid = campRes.data.campaign_id || campRes.data.campaign_snap_id || null;
                console.log("Compaine SAVE")
                console.log(campRes);
            }
        } catch (e) {
            console.error('createCampaign_plug error:', e);
        }

        return campignid;
    }

    async function getVideos() {
        const videoArray = [];
        let pages = 1;
        const firstRes = await safeFetchJson(`https://ads.tiktok.com/api/v3/i18n/statistics/material/list/?aadvid=${accountID}`, {
            headers: { "content-type": "application/json", "x-csrftoken": `${csrfToken}` },
            body: JSON.stringify({ m_type: 3, is_lifetime: 1, page: 1, page_size: 50 }),
            method: 'POST'
        });
        if (firstRes && firstRes.data) {
            pages = Math.ceil(firstRes.data.total / firstRes.data.page_size);
            firstRes.data.material_infos.forEach(item => {
                videoArray.push([{ video_info: { material_name: `${item.base_info.material_name}`, video_id: `${item.base_info.video_id}` }, image_info: [{ web_uri: `${item.base_info.material_cover.slice(item.base_info.material_cover.indexOf('.com/') + 5).split('~')[0].split('?')[0]}` }], image_mode: 15 }]);
            });
        }

        for (let i = 2; i <= pages; i++) {
            const pageRes = await safeFetchJson(`https://ads.tiktok.com/api/v3/i18n/statistics/material/list/?aadvid=${accountID}`, {
                headers: { "content-type": "application/json", "x-csrftoken": `${csrfToken}` },
                body: JSON.stringify({ m_type: 3, is_lifetime: 1, page: i, page_size: 50 }),
                method: 'POST'
            });
            if (pageRes && pageRes.data && pageRes.data.material_infos) {
                pageRes.data.material_infos.forEach(item => {
                    videoArray.push([{ video_info: { material_name: `${item.base_info.material_name}`, video_id: `${item.base_info.video_id}` }, image_info: [{ web_uri: `${item.base_info.material_cover.slice(item.base_info.material_cover.indexOf('.com/') + 5).split('~')[0].split('?')[0]}` }], image_mode: 15 }]);
                });
            }
        }

        return videoArray;
    }

    async function createAdset_plug(adsetOptions, CompaniInfo) {
        try {
            console.log('createAdset_plug');
            // ensure lastidJson exists in function scope to prevent ReferenceError in all code paths
            let lastidJson;

             // build image list from provided video name(s)
             let _imgList = [];
            for (let i = 0; i < countInAdset; i++) {
                const _vidName = adsetOptions.videoName.replace('!!!', adsetOptions.i + i);
                const res = allVideos.find(el => el[0] && el[0].video_info && el[0].video_info.material_name === _vidName);
                if (res){
                    let videos = res[0]
                    videos.identity_id="3f76ce09-fd2b-5947-8b40-1c3fcd85f413"
                    videos.identity_type =3
                    videos.item_source = 3
                    videos.media_tag = 5
                    _imgList.push(videos);
                }
            }

            if (_imgList.length === 0) {
                alert(`Такого видео в кабинете нет: ${adsetOptions.videoName}`);
                return;
            }

            // current video name for naming and urls
            let currentVideoName = _imgList[0].video_info.material_name;
            currentVideoName = currentVideoName.replaceAll('.mp4', '').replaceAll('_', '');

            // Отримати таймзону користувача або системну
            const timezone = await getzone();
            console.log("Detected timezone:", timezone);

            // Поточна дата з урахуванням зсуву
            let nowDate = new Date();

            // Якщо бюджет == 4444 — затримка 10 хв
            if (budget == 4444 || budget == "4444" || budget == "4444.00") {
                nowDate.setSeconds(nowDate.getSeconds() + 600);
            }

            // Початок через 30 секунд від поточного часу
            const startDt = new Date(nowDate.getTime() + 30 * 1000);

            // Кінець через 30 днів
            const endDt = new Date(nowDate.getTime() + 30 * 24 * 60 * 60 * 1000);

            // Функція форматування у формат "YYYY-MM-DD HH:mm:ss"
            function fmtDate(dt, tz) {
                const y = dt.toLocaleDateString("en-CA", { timeZone: tz }); // YYYY-MM-DD
                const t = dt.toLocaleTimeString("it-IT", { timeZone: tz, hour12: false }); // HH:mm:ss
                return `${y} ${t}`;
            }

            // Формуємо готові дати
            const start_time = fmtDate(startDt, timezone);
            const end_time = fmtDate(endDt, timezone);

            console.log("Start time:", start_time);
            console.log("End time:", end_time);
            // build ad_sketch_form_data following the provided sample
            const ad_sketch_form_data = {
                campaign_id:'',
                campaign_snap_id: CompaniInfo.campaign_snap_id,
                campaign_sketch_id: CompaniInfo.campaign_sketch_id,
                ad_sketch_form_data: {
                    coming_source_type: 1,
                    sketch_publish_source: 1,
                    campaign_id: adsetOptions.campaignId || '',
                    name: adsetOptions.adsetName ? adsetOptions.adsetName.replace('!!!', currentVideoName) : `Ad group ${currentVideoName}`,
                    objective_type: 3,
                    ttms_account_id: '',
                    feed_type: 1,
                    classify: 1,
                    inventory_flow_type: 1,
                    inventory_flow: [3000],
                    search_delivery_type: 3,
                    sub_placement_under_tiktok: [6],
                    creative_material_mode: 6,
                    identity_id: iconId || '',
                    identity_type: 0,
                    start_time: start_time,
                    end_time: end_time,
                    custom_tz_id: '7473424031766937618',//timezone || '',
                    custom_tz_type: 1,
                    external_type: 102,
                    is_comment_disable: 0,
                    is_share_disable: 0,
                    ad_download_status: 0,
                    exclude_app_package_id: '',
                    ad_ref_pixel_id: pixelId || '',
                    ad_ref_onsite_event_source_type: 0,
                    deep_funnel_toggle: 0,
                    deep_funnel_level: 0,
                    download_url: '',
                    collection_id: '',
                    ad_ref_message_event_set_id: '',
                    premiere_time: 0,
                    ac: [],
                    automated_targeting: 0,
                    ad_tag_v2: [],
                    in_market_tags: [],
                    interest_keywords_i18n: [],
                    interest_keywords_lang_i18n: [],
                    action_scenes_v2: [],
                    video_actions_v2: [],
                    action_categories_v2: [],
                    action_days_v2: [],
                    smart_interest_behavior: 0,
                    flow_package_exclude: [],
                    flow_package_include: [],
                    age: age && age.length ? age : [[18, 24], [25, 34], [35, 44], [45, 54], [55, 100]],
                    city: [],
                    country: country || [],
                    gender: (typeof gender !== 'undefined') ? Number(gender) : 0,
                    spending_power_v2: [],
                    is_hfss: 0,
                    enable_lhf_regulation: 0,
                    household_income: [],
                    language_list: [],
                    carriers: [],
                    internet_service_providers: [],
                    particle_locations: country || [],
                    zipcode_ids: [],
                    platform: [0],
                    device_models: [],
                    province: [],
                    districts: [],
                    targeting_expansion: {expansion_enabled: false, expansion_types: []},
                    exclude_custom_actions: [],
                    include_custom_actions: [],
                    retargeting_tags: [],
                    retargeting_tags_exclude: [],
                    suggestion_audience_toggle: 0,
                    smart_audience: 0,
                    smart_age: 0,
                    smart_gender: 0,
                    limited_audience: {age: []},
                    anti_discrimination: 0,
                    app_retargeting_type: 0,
                    app_retargeting_install: false,
                    launch_price: [],
                    device_type: 0,
                    contextual_tags: [],
                    saved_audience_id: 0,
                    search_keywords: [],
                    auto_keyword_state: 0,
                    is_brand_use_product_anchor: false,
                    dpa_retargeting_type: 0,
                    custom_audience_tag_relation: 0,
                    display_retargeting_tags: [],
                    display_retargeting_tags_exclude: [],
                    avatar_icon: {web_uri: iconURL || ''},
                    brand_safety: 1,
                    brand_safety_partner: 0,
                    suitability_non_garm_category: [],
                    vertical_suitability_id: 0,
                    budget: budget || adsetOptions.bid || '',
                    budget_mode: (budget && String(budget).trim() !== '') ? 3 : 0,
                    period: 0,
                    week_schedule: [[], [], [], [], [], [], []],
                    optimize_goal: 100,
                    cpv_video_duration_type: 0,
                    bid: adsetOptions.bid || '0',
                    cpa_bid: '0',
                    roas_bid: '0',
                    smart_bid_type: 7,
                    schedule_type: 1,
                    duration_time_range: 0,
                    flow_control_mode: 1,
                    cpa_delivery_mode: 0,
                    pricing: 9,
                    statistic_type: 0,
                    cpa_skip_first_phrase: 1,
                    bid_display_mode: 0,
                    mco_attribution_type: 1,
                    attribution_window_view: 1,
                    attribution_window_click: 7,
                    attribution_statistic_type: 2,
                    external_action: 96,
                    target_custom_conversion_id: '0',
                    deep_external_action: 0,
                    deep_bid_type: 0,
                    daily_retention_ratio: 0,
                    ad_ref_app_id: '',
                    app_type: 0,
                    promotion_website_type: 0,
                    rewarding_game_attestation: 0,
                    is_omni_optimize_v2: false,
                    supply_catalog_id: '0',
                    supply_bc_id: '0',
                    catalog_enable: 0,
                    promotion_catalog_type: 0,
                    promotion_target_type: 0,
                    target_device_version: 0,
                    ios14_quota_type: 1,
                    ad_app_profile_page_type: 0,
                    has_app_profile_auto_selectd: false,
                    bid_type_detail: 0,
                    payer_name: '',
                    payer_name_type: 0,
                    compensation_activity: 0,
                    ima_account_id: '',
                    phone_country_code: '',
                    phone_zip_code: '',
                    phone_number: '',
                    auto_pull_toggle: 0,
                    origin_ad_id: 0,
                    virtual_isolated: {_c_b_o: {validate_result: {}}, _a_o_s: {validate_result: {}}},
                    template_ad_flag: 1,
                    minis_id: '',
                    exclude_age_under_eighteen: 1,
                    activity_exclusion_type: 0,
                    budget_auto_adjust: {is_enabled: 0, initial_budget: '0'},
                    external_type1: 0,
                    avatar_icon1: {web_uri: ''},
                    external_type2: 0,
                    avatar_icon2: {web_uri: ''},
                    smart_auction_roi2_type: 0,
                    max_available_min_budget: null,
                    spc_targeting_switch: 0,
                    spc_upgrade_mode: 0,
                    by_ad_sketch_id: '',
                    ios_osv: '',
                    android_osv: '',
                    retargeting_audience_rule: {inclusions: null, exclusions: null},
                    ad_name: adsetOptions.adsetName ? adsetOptions.adsetName.replace('!!!', currentVideoName) : `Ad group ${currentVideoName}`,
                    ad_sketch_id: "",
                    ad_snap_id: ""

                },
                // clear_lower_level_sketches: false,
                spc_upgrade_mode: 1,
                with_sketch: true
            };
            let adsetId;
            let adScetchId;
            await fetch(`https://ads.tiktok.com/api/v4/i18n/creation/ad_snap/save/?aadvid=${accountID}&req_src=ad_creation`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify(ad_sketch_form_data),
                "method": "POST",
            }).then(res => res.json()
                .then(res => {
                    if (res.msg == 'success') {
                        console.log("ADs groupe SAVE")
                        console.log(res);
                        adsetId = res.data.ad_snap_id;
                        adScetchId = res.data.ad_sketch_id;

                    } else {
                        console.log(res)
                        console.log('Ошибка создание Адсета: ', res.msg);
                    }

                }));
            // Build creative_snap payload from lastidJson and ad sketch data (sample-based)
            // ensure lastidJson exists in this scope
            lastidJson = {
                 ad_ids: adsetId,
                 inventory_flow: [3000],
                 inventory_flow_type: 1,
                 objective_type: 3,
                 creative_material_mode: 2,
                 playable_url: "",
                 coming_source_type: 1,
                 is_smart_creative: true,
                 creative_name: `${currentVideoName}`,
                 app_name: "Sedric360",
                 source: iconName,
                 item_source: 0,
                 image_list:_imgList,
                 //     [
                 //
                 //     {
                 //         "video_info": {
                 //             "video_name": "symphony_api-20251012194555-Eig",
                 //             "cover_url": "https://p16.tiktokcdn.com/obj/tos-alisg-p-0051c001-sg/oUDLMZKxgItAOfCByeBEvgfQHeGfbGIQXOIAAM",
                 //             "verify": {
                 //                 "status": "success",
                 //                 "tip": "",
                 //                 "infos": [],
                 //                 "verify": {
                 //                     "supported": [
                 //                         {
                 //                             "key": 3000,
                 //                             "icon": "https://lf16-ttmp.byteintlstatic.com/obj/ttastatic-sg/ttam_standalone_vue/static/image/placement-tt.7e35c0fc.png",
                 //                             "label": "TikTok",
                 //                             "status": true,
                 //                             "message": [],
                 //                             "verify_code": 0,
                 //                             "verify_code_list": []
                 //                         }
                 //                     ],
                 //                     "unsupported": [],
                 //                     "all_pass": true,
                 //                     "all_reject": false,
                 //                     "all_msg": "",
                 //                     "error_msgs": []
                 //                 }
                 //             },
                 //             "vid": "v10033g50000d3lvvo7og65g8hmgogpg",
                 //             "file_md5": "fd917764c3af2941f666343b1812712f",
                 //             "cover_uri": "tos-alisg-p-0051c001-sg/oUDLMZKxgItAOfCByeBEvgfQHeGfbGIQXOIAAM",
                 //             "duration": 28,
                 //             "width": 1080,
                 //             "height": 1920,
                 //             "status": 10,
                 //             "bitrate": 16204106,
                 //             "file_name": "symphony_api-20251012194555-Eig",
                 //             "size": 57929682,
                 //             "video_id": "v10033g50000d3lvvo7og65g8hmgogpg",
                 //             "video_duration": 28,
                 //             "video_unique": "v10033g50000d3lvvo7og65g8hmgogpg",
                 //             "img_uri": "tos-alisg-p-0051c001-sg/oUDLMZKxgItAOfCByeBEvgfQHeGfbGIQXOIAAM",
                 //             "thumb_uri": "tos-alisg-p-0051c001-sg/oUDLMZKxgItAOfCByeBEvgfQHeGfbGIQXOIAAM",
                 //             "thumb_width": 1080,
                 //             "thumb_height": 1920,
                 //             "businesses": [
                 //                 127
                 //             ],
                 //             "auth_code_info": {}
                 //         },
                 //         "image_mode": 15,
                 //         "image_info": [
                 //             {
                 //                 "width": 1080,
                 //                 "height": 1920,
                 //                 "size": 57929682,
                 //                 "url": "https://p16.tiktokcdn.com/obj/tos-alisg-p-0051c001-sg/oUDLMZKxgItAOfCByeBEvgfQHeGfbGIQXOIAAM",
                 //                 "web_uri": "tos-alisg-p-0051c001-sg/oUDLMZKxgItAOfCByeBEvgfQHeGfbGIQXOIAAM"
                 //             }
                 //         ],
                 //         "media_tag": 5,
                 //         "item_source": 3,
                 //         "material_fake_id": "ccca58c4-040d-47e9-8575-6545442cd1b0",
                 //         "identity_id": "3f76ce09-fd2b-5947-8b40-1c3fcd85f413",
                 //         "identity_type": 3
                 //     },
                 //     {
                 //         "video_info": {
                 //             "video_name": "V_1.mp4",
                 //             "cover_url": "https://p16.tiktokcdn.com/obj/tos-alisg-p-0051c001-sg/oI23yAfEodIDHmmjBJwHIbiikcgoh0rxB5AcA0",
                 //             "verify": {
                 //                 "status": "success",
                 //                 "tip": "",
                 //                 "infos": [],
                 //                 "verify": {
                 //                     "supported": [
                 //                         {
                 //                             "key": 3000,
                 //                             "icon": "https://lf16-ttmp.byteintlstatic.com/obj/ttastatic-sg/ttam_standalone_vue/static/image/placement-tt.7e35c0fc.png",
                 //                             "label": "TikTok",
                 //                             "status": true,
                 //                             "message": [],
                 //                             "verify_code": 0,
                 //                             "verify_code_list": []
                 //                         }
                 //                     ],
                 //                     "unsupported": [],
                 //                     "all_pass": true,
                 //                     "all_reject": false,
                 //                     "all_msg": "",
                 //                     "error_msgs": []
                 //                 }
                 //             },
                 //             "vid": "v10033g50000d3lpm4vog65irh0tn83g",
                 //             "file_md5": "8412d3e850614829cc07bd10d225447f",
                 //             "cover_uri": "tos-alisg-p-0051c001-sg/oI23yAfEodIDHmmjBJwHIbiikcgoh0rxB5AcA0",
                 //             "duration": 28,
                 //             "width": 1080,
                 //             "height": 1920,
                 //             "status": 10,
                 //             "bitrate": 16204103,
                 //             "file_name": "V_1.mp4",
                 //             "size": 57929669,
                 //             "video_id": "v10033g50000d3lpm4vog65irh0tn83g",
                 //             "video_duration": 28,
                 //             "video_unique": "v10033g50000d3lpm4vog65irh0tn83g",
                 //             "img_uri": "tos-alisg-p-0051c001-sg/oI23yAfEodIDHmmjBJwHIbiikcgoh0rxB5AcA0",
                 //             "thumb_uri": "tos-alisg-p-0051c001-sg/oI23yAfEodIDHmmjBJwHIbiikcgoh0rxB5AcA0",
                 //             "thumb_width": 1080,
                 //             "thumb_height": 1920,
                 //             "businesses": [
                 //                 127
                 //             ],
                 //             "auth_code_info": {}
                 //         },
                 //         "image_mode": 15,
                 //         "image_info": [
                 //             {
                 //                 "width": 1080,
                 //                 "height": 1920,
                 //                 "size": 57929669,
                 //                 "url": "https://p16.tiktokcdn.com/obj/tos-alisg-p-0051c001-sg/oI23yAfEodIDHmmjBJwHIbiikcgoh0rxB5AcA0",
                 //                 "web_uri": "tos-alisg-p-0051c001-sg/oI23yAfEodIDHmmjBJwHIbiikcgoh0rxB5AcA0"
                 //             }
                 //         ],
                 //         "media_tag": 5,
                 //         "item_source": 3,
                 //         "material_fake_id": "8b8899d1-ea89-44ea-a1be-1913e8011ed1",
                 //         "identity_id": "3f76ce09-fd2b-5947-8b40-1c3fcd85f413",
                 //         "identity_type": 3
                 //     },
                 //     {
                 //         "video_info": {
                 //             "video_name": "symphony_api-20250922145500-Yr1",
                 //             "cover_url": "https://p16.tiktokcdn.com/obj/tos-alisg-p-0051c001-sg/ooagVDXsmI6z44IRNY4iUAjFBvKkriiRAkxAX",
                 //             "verify": {
                 //                 "status": "success",
                 //                 "tip": "",
                 //                 "infos": [],
                 //                 "verify": {
                 //                     "supported": [
                 //                         {
                 //                             "key": 3000,
                 //                             "icon": "https://lf16-ttmp.byteintlstatic.com/obj/ttastatic-sg/ttam_standalone_vue/static/image/placement-tt.7e35c0fc.png",
                 //                             "label": "TikTok",
                 //                             "status": true,
                 //                             "message": [],
                 //                             "verify_code": 0,
                 //                             "verify_code_list": []
                 //                         }
                 //                     ],
                 //                     "unsupported": [],
                 //                     "all_pass": true,
                 //                     "all_reject": false,
                 //                     "all_msg": "",
                 //                     "error_msgs": []
                 //                 }
                 //             },
                 //             "vid": "v10033g50000d38lf0nog65otb4e9o50",
                 //             "file_md5": "c92bae0f3e005ee1839544ec58f00f06",
                 //             "cover_uri": "tos-alisg-p-0051c001-sg/ooagVDXsmI6z44IRNY4iUAjFBvKkriiRAkxAX",
                 //             "duration": 28,
                 //             "width": 1080,
                 //             "height": 1920,
                 //             "status": 10,
                 //             "bitrate": 16208131,
                 //             "file_name": "symphony_api-20250922145500-Yr1",
                 //             "size": 57877210,
                 //             "video_id": "v10033g50000d38lf0nog65otb4e9o50",
                 //             "video_duration": 28,
                 //             "video_unique": "v10033g50000d38lf0nog65otb4e9o50",
                 //             "img_uri": "tos-alisg-p-0051c001-sg/ooagVDXsmI6z44IRNY4iUAjFBvKkriiRAkxAX",
                 //             "thumb_uri": "tos-alisg-p-0051c001-sg/ooagVDXsmI6z44IRNY4iUAjFBvKkriiRAkxAX",
                 //             "thumb_width": 1080,
                 //             "thumb_height": 1920,
                 //             "businesses": [
                 //                 127
                 //             ],
                 //             "auth_code_info": {}
                 //         },
                 //         "image_mode": 15,
                 //         "image_info": [
                 //             {
                 //                 "width": 1080,
                 //                 "height": 1920,
                 //                 "size": 57877210,
                 //                 "url": "https://p16.tiktokcdn.com/obj/tos-alisg-p-0051c001-sg/ooagVDXsmI6z44IRNY4iUAjFBvKkriiRAkxAX",
                 //                 "web_uri": "tos-alisg-p-0051c001-sg/ooagVDXsmI6z44IRNY4iUAjFBvKkriiRAkxAX"
                 //             }
                 //         ],
                 //         "media_tag": 5,
                 //         "item_source": 3,
                 //         "material_fake_id": "55c2ecfe-3387-4b73-bd3a-68eb774be610",
                 //         "identity_id": "3f76ce09-fd2b-5947-8b40-1c3fcd85f413",
                 //         "identity_type": 3
                 //     }
                 // ], //_imgList,
                 title_list: titles,
                 page_list: [],
                 card_list: [],
                 advanced_creative: [],
                call_to_action_asset_list:
                        [
                            {
                                "material_id": "201867_201369",
                                "asset_ids": [
                                    201867,
                                    201369
                                ],
                                "cta_content": "Interested",
                                "asset_source": 0,
                                "default_selected": true,
                                "asset_content": "Interested",
                                "asset_content_key": "interested"
                            },
                        {
                            "material_id": "201824_201616",
                            "asset_ids": [
                            201824,
                            201616
                        ],
                            "cta_content": "Visit store",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Visit store",
                            "asset_content_key": "visit_store"
                        },
                        {
                            "material_id": "201964_201490",
                            "asset_ids": [
                            201964,
                            201490
                        ],
                            "cta_content": "Watch now",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Watch now",
                            "asset_content_key": "watch_now"
                        },
                        {
                            "material_id": "201826_201618",
                            "asset_ids": [
                            201826,
                            201618
                        ],
                            "cta_content": "Follow us now",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Follow us now",
                            "asset_content_key": "ad_format_cta_follow_us_now"
                        },
                        {
                            "material_id": "201924_201426",
                            "asset_ids": [
                            201924,
                            201426
                        ],
                            "cta_content": "Follow us to watch",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Follow us to watch",
                            "asset_content_key": "ad_format_cta_follow_us_to_watch"
                        },
                        {
                            "material_id": "201960_201486",
                            "asset_ids": [
                            201960,
                            201486
                        ],
                            "cta_content": "Take a look",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Take a look",
                            "asset_content_key": "ad_format_cta_take_a_look"
                        },
                        {
                            "material_id": "202001_201529",
                            "asset_ids": [
                            202001,
                            201529
                        ],
                            "cta_content": "View now",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "View now",
                            "asset_content_key": "view_now"
                        },
                        {
                            "material_id": "202156_202150",
                            "asset_ids": [
                            202156,
                            202150
                        ],
                            "cta_content": "Check it out",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Check it out",
                            "asset_content_key": "ad_format_cta_check_it_out"
                        },
                        {
                            "material_id": "201829_201621",
                            "asset_ids": [
                            201829,
                            201621
                        ],
                            "cta_content": "Read more",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Read more",
                            "asset_content_key": "read_more"
                        },
                        {
                            "material_id": "201781_201535",
                            "asset_ids": [
                            201781,
                            201535
                        ],
                            "cta_content": "Learn more ",
                            "asset_source": 0,
                            "default_selected": true,
                            "asset_content": "Learn more ",
                            "asset_content_key": "learn_more"
                        }
                    ],
                 call_to_action_list: [],//button_video
                 call_to_action_id: "",
                 avatar_icon: { url: "https://p21-ad-sg.ibyteimg.com/obj/" + iconURL, width: 336, web_uri: iconURL, height: 336 },
                 identity_id: '3f76ce09-fd2b-5947-8b40-1c3fcd85f413',
                 identity_type: 3,
                 open_url: "",
                 is_open_url: 0,
                 auto_open: 0,
                 external_url: (adsetOptions.url || '').replace('!!!', currentVideoName),
                 external_url_domain: "",
                 fallback_type: 0,
                 is_creative_authorized: false,
                 is_presented_video: 0,
                 agr_task_ids: [],
                 track_url: [],
                 action_track_url: [],
                 vast_moat: 0,
                 vast_double_verify: 0,
                 vast_ias: false,
                 vast_url: "",
                 tracking_pixel_id: pixelId,
                 tracking_app_id: "0",
                 tracking_offline_event_set_ids: [],
                 destination_url_type: "WEB_SITE",
                 attachment_creative_preview_url: "",
                 attachment_creative_type: 0,
                 card_id: "",
                 page_id: "",
                 has_creative: false,
                 ad_source_value: -1,
                 ad_type_value: -1,
                 brand_safety_vast_url: "",
                 brand_safety_postbid_partner: 0,
                 is_brandsafety_track_open: false,
                 urls_precheck_result: { material_results: [], summary_results: [], success: false },
                 struct_version: 1,
                 ad_channel: 1
             };


             try {
                 const asset = Object.assign({}, lastidJson, {
                     // normalize image_list entries if needed
                     image_list: lastidJson.image_list || [],
                     title_list: lastidJson.title_list || (titles || []).map(t => ({ title: t.title || t })),
                     avatar_icon: lastidJson.avatar_icon || { url: iconURL ? ('https://p21-ad-sg.ibyteimg.com/obj/' + iconURL) : '', web_uri: iconURL || '', width: 336, height: 336 },
                     identity_id: lastidJson.identity_id || adsetJson && adsetJson.base_info && adsetJson.base_info.identity_id || iconId || '',
                     identity_type: lastidJson.identity_type || 1,
                     external_url: lastidJson.external_url || (adsetOptions.url || '').replace('!!!', currentVideoName),
                 });

                 const creativeSnapPayload = {
                    // ad_id: "",
                     campaign_snap_id: CompaniInfo.campaign_snap_id,
                     campaign_sketch_id: CompaniInfo.campaign_sketch_id,
                     ad_sketch_id: adScetchId,
                     ad_snap_id: adsetId,
                    with_sketch: true,
                    asset_group_sketch_form_data_list: [ {
                        creator_plus_mode: 0,
                        creative_reco_config: {},
                        auto_pull_by_destination_toggle: 2,
                        auto_pull_by_aigc_toggle: 2,
                        app_name: asset.app_name || '',
                        dark_post_status: 1,
                        image_list: asset.image_list,
                        title_list: asset.title_list,
                        playable_list: asset.playable_list || [],
                        call_to_action_list: asset.call_to_action_list || [],
                        call_to_action_id: asset.call_to_action_id || '',
                        avatar_icon: asset.avatar_icon,
                        identity_id: asset.identity_id,
                        identity_type: asset.identity_type,
                        open_url: asset.open_url || '',
                        is_open_url: asset.is_open_url || 0,
                        auto_open: asset.auto_open || 0,
                        track_url: asset.track_url || [],
                        action_track_url: asset.action_track_url || [],
                        tracking_message_event_set_id: asset.tracking_message_event_set_id || '',
                        item_source: asset.item_source || 2,
                        page_list: asset.page_list || [],
                        card_id: asset.card_id || '',
                        attachment_creative_preview_url: asset.attachment_creative_preview_url || '',
                        attachment_creative_type: asset.attachment_creative_type || 0,
                        enable_url: !!asset.external_url,
                        external_url: asset.external_url || '',
                        utms: asset.utms || [],
                        utm_auto_switch: asset.utm_auto_switch || 2,
                        product_info_type: asset.product_info_type || 0,
                        product_info: asset.product_info || {},
                        product_info_recommend: asset.product_info_recommend || {},
                        auto_selected_vids: asset.auto_selected_vids || [],
                        supply_catalog_creative_toggle: asset.supply_catalog_creative_toggle || false,
                        video_tpl_name: asset.video_tpl_name || '',
                        creative_name: asset.creative_name || (`${currentVideoName}`),
                        call_to_action_asset_list: asset.call_to_action_asset_list || [],
                        ad_ids: asset.ad_ids || [],
                        asset_group_ids: asset.asset_group_ids || [''],
                        objective_type: asset.objective_type || 3,
                        inventory_flow: asset.inventory_flow || [3000],
                        inventory_flow_type: asset.inventory_flow_type || 1,
                        creative_material_mode: asset.creative_material_mode || 6,
                        struct_version: asset.struct_version || 1,
                        creative_snap_id: asset.creative_snap_id || '',
                        creative_sketch_id: asset.creative_sketch_id || '',
                        need_create_cta_id: true,
                        coming_source_type: asset.coming_source_type || 1
                    } ],

                    spc_upgrade_mode: 1,
                    risk_info: {
                        user_agent: navigator.userAgent || '',
                        referrer: document.referrer || '',
                        cookie_enabled: navigator.cookieEnabled,
                        screen_width: window.screen.width || 1920,
                        screen_height: window.screen.height || 1080,
                        browser_language: navigator.language || 'en-US',
                        browser_platform: navigator.platform || 'Web',
                        browser_name: navigator.appName || 'Mozilla',
                        browser_version: navigator.userAgent || '',
                        browser_online: navigator.onLine,
                        timezone_name: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
                    }
                };

                const finalCreativeRes = await safeFetchJson(`https://ads.tiktok.com/api/v4/i18n/creation/creative_snap/save/?aadvid=${accountID}&req_src=ad_creation`, {
                    headers: { 'content-type': 'application/json;charset=UTF-8', 'x-csrftoken': `${csrfToken}` },
                    body: JSON.stringify(creativeSnapPayload),
                    method: 'POST'
                });

                console.log('creative_snap save response:', finalCreativeRes);
                var creative_snap_id = finalCreativeRes?.data?.creative_snap_ids;
                var creative_sketch_id= finalCreativeRes?.data?.creative_sketch_ids;
                try {
                    const normalizeId = (value) => {
                        if (Array.isArray(value)) {
                            value = value[0];
                        }
                        if (value === null || value === undefined) {
                            return '';
                        }
                        return String(value).trim();
                    };

                    const ensureNonEmpty = (value) => value && value.length ? value : '';

                    const campaign_id = ensureNonEmpty(normalizeId(CompaniInfo && CompaniInfo.campaign_id));
                    const campaign_snap_id = ensureNonEmpty(normalizeId(CompaniInfo && CompaniInfo.campaign_snap_id));
                    const campaign_sketch_id = ensureNonEmpty(normalizeId(CompaniInfo && CompaniInfo.campaign_sketch_id));
                    const ad_snap_id = ensureNonEmpty(normalizeId(adsetId));
                    const ad_sketch_id = ensureNonEmpty(normalizeId(adScetchId));
                    const creative_snap_publish_id = ensureNonEmpty(normalizeId(creative_snap_id));
                    const creative_sketch_publish_id = ensureNonEmpty(normalizeId(creative_sketch_id));

                    if (!campaign_snap_id || !campaign_sketch_id || !creative_snap_publish_id || !creative_sketch_publish_id || !ad_snap_id || !ad_sketch_id) {
                        console.error('Missing identifiers required for publish', {
                            campaign_snap_id,
                            campaign_sketch_id,
                            creative_snap_publish_id,
                            creative_sketch_publish_id,
                            ad_snap_id,
                            ad_sketch_id,
                        });
                        return;
                    }

                    const buildPublishPayload = () => {
                        const payload = {
                            campaign_id,
                            campaign_snap_id,
                            campaign_sketch_id,
                            coming_source_type: 1,
                            sketch_publish_source: 2,
                            need_publish: true,
                            is_partial_publish: false,
                            publish_immediately: true,
                            ad_and_creative_snap_info_list: [
                                {
                                    ad_id: '',
                                    ad_snap_id,
                                    ad_sketch_id,
                                    need_publish: true,
                                    creative_snap_info_list: [
                                        {
                                            creative_id: '',
                                            creative_snap_id: creative_snap_publish_id,
                                            creative_sketch_id: creative_sketch_publish_id,
                                            need_publish: true
                                        }
                                    ]
                                }
                            ]
                        };

                        // drop campaign_id if still empty, TikTok rejects explicit empty strings
                        if (!payload.campaign_id) {
                            delete payload.campaign_id;
                        }

                        return payload;
                    };

                    const finJSON = buildPublishPayload();
                    const publishComp = await safeFetchJson(`https://ads.tiktok.com/api/v4/i18n/creation/async_creation/create_by_snap/?aadvid=${accountID}`, {
                        headers: {'content-type': 'application/json;charset=UTF-8', 'x-csrftoken': `${csrfToken}`},
                        body: JSON.stringify(finJSON),
                        method: 'POST'
                    });
                    console.log('publishComp publish response:', publishComp);

                    const needsFollowUpPublish = publishComp && publishComp.data && (publishComp.data.need_manual_publish || publishComp.data.publish_status === 0);

                    if (needsFollowUpPublish) {
                        const publishNowPayload = {
                            campaign_snap_id,
                            campaign_sketch_id,
                            sketch_publish_source: 2,
                            need_publish: true,
                            publish_scene: 1,
                            publish_infos: [
                                {
                                    ad_snap_id,
                                    ad_sketch_id,
                                    need_publish: true,
                                    creative_snap_ids: [creative_snap_publish_id],
                                    creative_sketch_ids: [creative_sketch_publish_id]
                                }
                            ]
                        };

                        const publishNowRes = await safeFetchJson(`https://ads.tiktok.com/api/v4/i18n/creation/async_creation/publish_by_snap/?aadvid=${accountID}`, {
                            headers: {'content-type': 'application/json;charset=UTF-8', 'x-csrftoken': `${csrfToken}`},
                            body: JSON.stringify(publishNowPayload),
                            method: 'POST'
                        });
                        console.log('publish_by_snap response:', publishNowRes);
                    }
                }catch (e) {
                    console.log('Publish error:', e);
                }

            } catch (e) {
                console.error('creative_snap save error:', e);
            }
        } catch (e) {
            console.error('createAdset_plug error:', e);
            return;
        }

    }


// === TTT Manual Creation Tracker =============================
    // Перехоплює ручні створення кампаній/адсетів/адів на ads.tiktok.com
    (function () {
        if (window.__tttTrackerInstalled) return;
        window.__tttTrackerInstalled = true;

        const STORE_KEY = 'ttt_manual_creations';

        const tryParse = (t) => {
            if (typeof t !== 'string') return t;
            try { return JSON.parse(t); } catch { return t; }
        };

        const save = (record) => {
            try {
                const arr = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
                arr.push(record);
                while (arr.length > 100) arr.shift(); // тримаємо останні 100 записів
                localStorage.setItem(STORE_KEY, JSON.stringify(arr));
            } catch (e) { console.warn('[TTT Tracker] save failed', e); }
        };

        const notify = (detail) => {
            try {
                window.dispatchEvent(new CustomEvent('ttt_campaign_created', { detail }));
            } catch {}
        };

        // Які URL вважаємо «створенням»
        const shouldWatch = (url, method) => {
            const u = typeof url === 'string' ? url : (url && url.url) || '';
            if (!/ads\.tiktok\.com/.test(u)) return false;
            if ((method || 'GET').toUpperCase() !== 'POST') return false;
            // create/save на різних маршрутках + graphql-мутатори:
            return /(\/api\/v\d+\/.*(campaign|adgroup|ad|perf).*\/(create|save)|\/graphql)/i.test(u);
        };

        // -------- fetch ----------
        const origFetch = window.fetch;
        window.fetch = async function (input, init = {}) {
            const method = (init && init.method) || (input && input.method) || 'GET';
            const url = typeof input === 'string' ? input : (input && input.url);

            let bodyText = null;
            try {
                const req = input instanceof Request ? input : new Request(url, init);
                if (shouldWatch(req.url, req.method) && req.method === 'POST') {
                    bodyText = await req.clone().text();
                }
            } catch {}

            const res = await origFetch(input, init);

            try {
                if (shouldWatch(url, method)) {
                    const resText = await res.clone().text();
                    const record = {
                        t: Date.now(),
                        transport: 'fetch',
                        url,
                        method,
                        request: tryParse(bodyText),
                        response: tryParse(resText),
                        status: res.status,
                    };
                    save(record);
                    notify(record);
                    console.log('[TTT Tracker]', record);
                }
            } catch {}

            return res;
        };

        // -------- XHR ----------
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this.__tttInfo = { method, url };
            return origOpen.call(this, method, url, ...rest);
        };

        XMLHttpRequest.prototype.send = function (body) {
            const info = this.__tttInfo || {};
            const bodyText = (body instanceof Document)
                ? new XMLSerializer().serializeToString(body)
                : (typeof body === 'string' ? body : body ? String(body) : '');

            const onLoad = () => {
                try {
                    if (shouldWatch(info.url, info.method)) {
                        const record = {
                            t: Date.now(),
                            transport: 'xhr',
                            url: info.url,
                            method: info.method,
                            request: tryParse(bodyText),
                            response: tryParse(this.responseText),
                            status: this.status,
                        };
                        save(record);
                        notify(record);
                        console.log('[TTT Tracker]', record);
                    }
                } catch {}
                this.removeEventListener('load', onLoad);
            };

            this.addEventListener('load', onLoad);
            return origSend.call(this, body);
        };

        // -------- Публічне API для тебе ----------
        window.tttTracker = {
            getAll() {
                try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
                catch { return []; }
            },
            clear() { localStorage.removeItem(STORE_KEY); },
            // фільтр по URL/методу/статусу
            find(fn) { return this.getAll().filter(fn); },
        };

        // -------- Мала кнопка у вкладці «Доп возможности» ----------
        const injectBtn = () => {
            const tab = document.querySelector('#ttt_plugin_tab3');
            if (!tab || tab.querySelector('.ttt_show_tracker')) return;

            const btn = document.createElement('button');
            btn.className = 'w3-button w3-margin-bottom w3-medium w3-green ttt_show_tracker';
            btn.textContent = 'Показати останні 10 створень';
            btn.addEventListener('click', () => {
                const data = window.tttTracker.getAll();
                alert(JSON.stringify(data.slice(-10), null, 2));
            });
            tab.prepend(btn);
        };

        // спробуємо кілька разів (поки з’явиться розмітка плагіна)
        const i = setInterval(() => {
            injectBtn();
            if (document.querySelector('#ttt_plugin_tab3')) clearInterval(i);
        }, 800);

    })();


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



//3

//settings
//settings
    let MINS = 5;
    window.ttt_adsets = {}


//settings end
    var accountID = document.URL.slice(document.URL.indexOf('aadvid=') + 7);
    var csrfToken = document.cookie.slice(document.cookie.indexOf('csrftoken=')).split(';')[0].split('=')[1];
    var accounts = [];
    let interval, timerInterval, tick, counterOfCheck;
    tick = 0;
    counterOfCheck = 0;

    async function autorulesStart() {
        getActiveAdGroups();
    }

    function startInterval() {
        interval = setInterval(intervalFunc, MINS * 60 * 1000);
    }

    function startTimerInterval() {
        timerInterval = setInterval(timer, 60 * 1000);
    }

// DRAW WINDOW
    let butn, divActiveAd, divActiveAdTD, divTimer, divLogs, btnStart, btnStop;
    let returnDiv, returnSelect, returnBtn, deletedTable;

    let autorulesOptions = {
        'offAdsets': true,
        'offCampaigns': true,

        'returnAdsets': true,
        'returnOption': 'cnv',

        'delBanAdsets': true,

        'makeAdsetDubl': true,
        'makeAdsetDublCountOfCnv': 1,
        'makeAdsetDublCountOfDubl': 3,

        'makeAdsetDublNewCampaign': true,
        'makeAdsetDublNewCampaignCountOfCnv': 3,
        'makeAdsetDublNewCampaignCountOfDubl': 3,

        'onMathAdsets': true,
    };

    function drawWindow1() {
        mainDiv1 = document.createElement('div');
        mainDiv1.className = "ttt_main_wrapper";
        document.body.appendChild(mainDiv1);

        mainDiv1.innerHTML = `<button id="ttt_plugin_openButton"
    class="w3-button w3-circle w3-blue w3-hover-purple w3-tiny w3-padding-small"></button>

    <div id="ttt_plugin_modal" class="w3-hide ttt-window w3-border w3-card">
        <div class="w3-modal-content w3-animate-right">
            <div class="w3-container w3-padding-16">
                <span id="ttt_plugin_closeModal"
                    class="w3-button w3-display-topright w3-hover-red">&times;</span>

                <div class="w3-row">
                    <a href="#" class="ttt-open-tab" data-tabname="ttt_plugin_tab1">
                        <div class="w3-quarter tablink w3-bottombar w3-border-red w3-hover-light-grey w3-padding">Автозалив</div>
                    </a>
                    <a href="#" class="ttt-open-tab" data-tabname="ttt_plugin_tab2">
                        <div class="w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding">Автоправила</div>
                    </a>
                    <a href="#" class="ttt-open-tab" data-tabname="ttt_plugin_tab3">
                        <div class="w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding">Доп возможност��</div>
                    </a>

                   <span style="float: right;margin-top: 20px;">v 4.0.1</span>
                </div>

                <div id="ttt_plugin_tab1" class="w3-container ttt-tab-body w3-padding-16">
                    <div class="w3-container w3-light-grey w3-margin-bottom w3-padding-16">
                        <div class="w3-row-padding">
                            <div class="w3-third">
                                <label>Шаблоны</label>
                                <select name="ttt_templates" id="ttt_templates" class="w3-select">
                                </select>
                            </div>
                            <div class="w3-third">
                                <label>Название</label>
                                <input class="w3-input w3-border-0" id="ttt_template_name" type="text"
                                    name="ttt_template_name">
                            </div>
                            <div class="w3-third ttt-mt-23">
                                <button class="w3-button w3-medium w3-blue ttt_templates_save">Сохранить</button>
                                <button class="w3-button w3-medium w3-red ttt_templates_delete">Удалить</button>
                            </div>
                        </div>
                    </div>
                    <form class="w3-container w3-light-grey ttt_autozaliv_form">

                        <div class="w3-row-padding">
<!--                            <div class="w3-third w3-margin-top">-->
<!--                                <label>Для саб3</label>-->
<!--                                <input class="ttt_input_field w3-input w3-border-0" type="text" name="ttt_subid3"-->
<!--                                    placeholder="subid3">-->
<!--                            </div>-->
                            <div class="w3-third w3-margin-top">
                                <input class="ttt_input_field w3-check" type="checkbox" id="ttt_smart" name="ttt_smart" checked="checked"
                                    value="Smart">
                                    <label>Смарт компанія</label>
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Pixel TT</label>
                                <select name="ttt_pixel" id="ttt_pixel" class="w3-select ttt_input_field"><option value=""></option> </select>
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Название оффера</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="text" name="ttt_offerName"
                                    placeholder="ideal_PE">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Ставка для автоправил</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="number" step="0.01" name="ttt_BIP"
                                    placeholder="0.70">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Ссылка на оффер</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="text" name="ttt_offerMainLink"
                                    placeholder="https://tabatashop2.ru/YTq1hpbPzz">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Страна</label>
                                <select multiple="" name="ttt_country" id="ttt_country" class="w3-select ttt_input_field" style="height: 180px;">
                                   <option value="3865483">Argentina</option>
                                   <option value="2077456">Australia</option>
                                   <option value="2782113">Austria</option>
                                   <option value="290291">Bahrain</option>
                                   <option value="630336">Belarus</option>
                                   <option value="2802361">Belgium</option>
                                   <option value="3469034">Brazil</option>
                                   <option value="1831722">Cambodia</option>
                                   <option value="6251999">Canada</option>
                                   <option value="3895114">Chile</option>
                                   <option value="3686110">Colombia</option>
                                   <option value="3077311">Czech Republic</option>
                                   <option value="2623032">Denmar</option>
                                   <option value="3658394">Ecuador</option>
                                   <option value="357994">Egypt</option>
                                   <option value="660013">Finland</option>
                                   <option value="3017382">France</option>
                                   <option value="2921044">Germany</option>
                                   <option value="390903">Greece</option>
                                   <option value="719819">Hungary</option>
                                   <option value="1643084">Indonesia</option>
                                   <option value="99237">Iraq</option>
                                   <option value="2963597">Ireland</option>
                                   <option value="294640">Israel</option>
                                   <option value="3175395">Italy</option>
                                   <option value="1861060">Japan</option>
                                   <option value="248816">Jordan</option>
                                   <option value="1522867">Kazakhstan</option>
                                   <option value="285570">Kuwait</option>
                                   <option value="272103">Lebanon</option>
                                   <option value="1733045">Malaysia</option>
                                   <option value="3996063">Mexico</option>
                                   <option value="2542007">Morocco</option>
                                   <option value="2750405">Netherlands</option>
                                   <option value="2186224">New Zealand</option>
                                   <option value="3144096">Norway</option>
                                   <option value="286963">Oman</option>
                                   <option value="1168579">Pakistan</option>
                                   <option value="3932488">Peru</option>
                                   <option value="1694008">Philippines</option>
                                   <option value="798544">Poland</option>
                                   <option value="2264397">Portugal</option>
                                   <option value="289688">Qatar</option>
                                   <option value="798549">Romania</option>
                                   <option value="2017370">Russia</option>
                                   <option value="102358">Saudi Arabia</option>
                                   <option value="1880251">Singapore</option>
                                   <option value="953987">South Africa</option>
                                   <option value="1835841">South Korea</option>
                                   <option value="2510769">Spain</option>
                                   <option value="2661886">Sweden</option>
                                   <option value="2658434">Switzerland</option>
                                   <option value="1668284">Taiwan</option>
                                   <option value="1605651">Thailand</option>
                                   <option value="298795">Turkey</option>
                                   <option value="690791">Ukraine</option>
                                   <option value="290557">United Arab Emirates</option>
                                   <option value="2635167">United Kingdom</option>
                                   <option value="6252001">United States</option>
                                   <option value="3439705">Uruguay</option>
                                   <option value="1562822">Vietnam</option>
                                </select>
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Бюджет</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="number" name="ttt_budget"
                                    placeholder="5000">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Ссылка на иконку</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="text" name="ttt_iconURL"
                                    placeholder="ad-site-i18n-sg/202112235d0d4cea0500803a4c73b084">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Название иконки</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="text" name="ttt_iconName"
                                    placeholder="Idealica">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Количество крео в адсете</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="number" min="1" max="10" value="1" name="ttt_ads_count"
                                    placeholder="1">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Количество копий адсета</label>
                                <input class="ttt_input_field w3-input w3-border-0" type="number" max="20" value="0" name="ttt_ads_double"
                                    placeholder="0">
                            </div>
                            <div class="w3-third w3-margin-top">
                                <label>Кнопка</label>
                                <select name="ttt_button" id="ttt_button" class="w3-select ttt_input_field">
                                    <option value="learn_more">Learn more</option>
                                    <option value="download">Download</option>
                                    <option value="shop_now">Shop now</option>
                                    <option value="sign_up">Sign up</option>
                                    <option value="contact_us">Contact us</option>
                                    <option value="apply_now">Apply now</option>
                                    <option value="book_now">Book now</option>
                                    <option value="play_game">Play game</option>
                                    <option value="watch_now">Watch now</option>
                                    <option value="read_more">Read more</option>
                                    <option value="view_now">View now</option>
                                    <option value="get_quote">Get quote</option>
                                    <option value="order_now">Order now</option>
                                    <option value="install_now">Install now</option>
                                    <option value="get_showtimes">Get showtimes</option>
                                    <option value="listen_now">Listen now</option>
                                    <option value="interested">Interested</option>
                                    <option value="subscribe">Subscribe</option>
                                    <option value="get_tickets_now">Get tickets now</option>
                                    <option value="experience_now">Experience now</option>
                                    <option value="pre_order_now">Pre-order now</option>
                                    <option value="visit_store">Visit store</option>
                                </select>
                            </div>
                        </div>

                        <div class="w3-row-padding">
                            <div class="w3-margin-top">
                                <input class="ttt_input_field w3-radio" type="radio" name="ttt_gender" value="0" checked>
                                <label>Все</label>

                                <input class="ttt_input_field w3-radio" type="radio" name="ttt_gender" value="1">
                                <label>Мужчины</label>

                                <input class="ttt_input_field w3-radio" type="radio" name="ttt_gender" value="2">
                                <label>Женщины</label>
                            </div>
                            <div class="w3-margin-top">
                                <input class="ttt_input_field w3-check" type="checkbox" name="ttt_age" checked="checked"
                                    value="All">
                                <label>Все</label>
                                <input class="ttt_input_field w3-check" type="checkbox" name="ttt_age"
                                    value="18-24">
                                <label>18-24</label>
                                <input class="ttt_input_field w3-check" type="checkbox" name="ttt_age"
                                    value="25-34">
                                <label>25-34</label>
                                <input class="ttt_input_field w3-check" type="checkbox" name="ttt_age"
                                    value="35-44">
                                <label>35-44</label>
                                <input class="ttt_input_field w3-check" type="checkbox" name="ttt_age"
                                    value="45-54">
                                <label>45-54</label>
                                <input class="ttt_input_field w3-check" type="checkbox" name="ttt_age"
                                    value="55-100">
                                <label>55-100</label>
                            </div>
                        </div>
                        <div class="w3-row-padding">
                            <div class="w3-margin-top">
                                <input class="ttt_input_field w3-radio" type="radio" name="tttt_stavka" value="1" >
                                <label>Авто-ставка</label>

                                <input class="ttt_input_field w3-radio" type="radio" name="tttt_stavka" value="2" >
                                <label>Фикс ставка</label>
                            </div>
                        </div>

                        <div
                            class="w3-row-padding w3-border w3-margin-top w3-padding-16 ttt-no-padding-top ttt_videos">
                            <h4>Видео</h4>
                            <div class="w3-row-padding w3-margin-top ttt_inputs_block">
                                <div class="w3-quarter">
                                    <label>Название (!!!)</label>
                                    <input class="ttt_input_field w3-input w3-border-0" type="text" name="video_name"
                                        placeholder="457T_Idealica_BE_!!!.mp4">
                                </div>
                                <div class="w3-quarter">
                                    <label>Количество</label>
                                    <input class="ttt_input_field w3-input w3-border-0" type="number" placeholder="10"
                                        name="count">
                                </div>
                                <div class="w3-quarter ttt-mt-30">
                                    <button
                                        class="w3-button w3-circle w3-blue w3-tiny w3-padding-small ttt_add_inputsGroup">+</button>
                                    <button
                                        class="w3-button w3-circle w3-red w3-tiny w3-padding-small ttt_remove_inputsGroup">-</button>
                                </div>
                            </div>
                        </div>

                        <div
                            class="w3-row-padding w3-border w3-margin-top w3-padding-16 ttt-no-padding-top ttt_bids">
                            <h4>Биды</h4>
                            <div class="w3-row-padding w3-margin-top ttt_inputs_block">
                                <div class="w3-threequarter">
                                    <label>Сумма бида</label>
                                    <input class="ttt_input_field w3-input w3-border-0" type="number" step="0.01" placeholder="3.00"
                                        name="bid_summ">
                                </div>
                                <div class="w3-quarter ttt-mt-30">
                                    <button
                                        class="w3-button w3-circle w3-blue w3-tiny w3-padding-small ttt_add_inputsGroup">+</button>
                                    <button
                                        class="w3-button w3-circle w3-red w3-tiny w3-padding-small ttt_remove_inputsGroup">-</button>
                                </div>
                            </div>
                        </div>
                        <div
                            class="w3-row-padding w3-border w3-margin-top w3-padding-16 ttt-no-padding-top ttt_titles">
                            <h4>Описания</h4>
                            <div class="w3-row-padding w3-margin-top ttt_inputs_block">
                                <div class="w3-threequarter">
                                    <label>Описание</label>
                                    <input class="ttt_input_field w3-input w3-border-0" type="text" name="title"
                                        placeholder="Es fácil ser delgado">
                                </div>
                                <div class="w3-quarter ttt-mt-30">
                                    <button
                                        class="w3-button w3-circle w3-blue w3-tiny w3-padding-small ttt_add_inputsGroup">+</button>
                                    <button
                                        class="w3-button w3-circle w3-red w3-tiny w3-padding-small ttt_remove_inputsGroup">-</button>
                                </div>
                            </div>
                        </div>

                        <div class="w3-center w3-margin-top">
                            <div class="w3-bar">
                                <button
                                    class="w3-button w3-blue w3-hover-green w3-round-large ttt_start_autozaliv">Бабло!</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div id="ttt_plugin_tab2" class="w3-container ttt-tab-body w3-padding-16" style="display:none">
                    <span class="w3-badge w3-green ttt-timer"></span>

                        <form action="" class="w3-container">

                            <div class="w3-row-padding w3-margin-top">
                                <button class="w3-button w3-medium w3-blue ttt_autorules_enable" type="submit">Старт</button>
                                <button class="w3-button w3-medium w3-red ttt_autorules_disable"
                                    disabled>Стоп</button>
                            </div>




                            <div class="w3-row-padding w3-margin-top ttt_optionsBlock" >
                                <h3>Настройки автопроверки: </h3>
                                <label>Проверка за </label>
                                <select name="ttt_retSel" id="check_time" class="w3-select">
                                    <option value="0">Сегодня</option>
                                    <option value="1">2 дня</option>
                                    <option value="2">3 дня</option>
                                </select>
                                <br>
                                <input class="ttt_input_field w3-check" type="checkbox" checked="checked" id="off_adgroups">
                                <label>Отключать адсеты</label>
                                <br>

                                <input class="ttt_input_field w3-check" type="checkbox" checked="checked" id="off_campaigns">
                                <label>Отключать кампании</label>
                                <br>

                                <input class="ttt_input_field w3-check" type="checkbox" checked="checked" id="return_adgroups">
                                <label>Восстанавливать адсеты</label>
                                <select name="ttt_retSel" id="retSel" class="w3-select" disabled>
                                    <option value="every">Все</option>
                                    <option value="show">Показы > 0</option>
                                    <option value="click">Клики > 0</option>
                                    <option value="cnv" selected>Конверсии > 0</option>
                                </select>
                                <br>

                                <input class="ttt_input_field w3-check" type="checkbox" checked="checked" id="delete_adgroups">
                                <label>Удалять адсеты</label>
                                <br>

                                <input class="ttt_input_field w3-check" type="checkbox" checked="checked" id="double_adsets">
                                <label>Дублировать адсеты</label>
                                <input class="" min="1" value="1" required type="number" id="double_adsetsLeads">
                                <label>К-во лид.</label>
                                <input class="" min="1" value="3" required type="number" id="double_adsetsCopy">
                                <label>К-во дублей</label>
                                <br>

                                <input class="ttt_input_field w3-check" type="checkbox" checked="checked" id="double_adsetsCamp">
                                <label>Дубл. адсеты в новую камп.</label>
                                <input class="" min="1" value="3" required type="number" id="double_adsetsCampLeads">
                                <label>К-во лид.</label>
                                <input class="" min="1" value="3" required type="number" id="double_adsetsCampCopy">
                                <label>К-во дублей</label>
                                <br>

                            </div>
                        </form>


                        <div class="ttt_ext-tt_accountListDiv" style="margin: 20px 0; font-size: 20px;">
                        <div class="">
                            <span class="ttt_accountListDiv_add">Кабинет: </span>
                            <input type="number"
                            style="width: 250px;" id="ttt_ext-tt_accountForAdd" placeholder="ID кабинета">
                            <input type="text" id="ttt_ext-tt_accountDesc" placeholder="Описание">
                            <button class="w3-button w3-green"
                            style="padding: 4px 16px;
                            border-radius: 3px;" id="ttt_ext-tt_addAccountBtn">Добавить</button>

                            <div class="ttt_accountListDiv_list">
                            </div>
                        </div>
                    </div>


                        <div class="ttt_active_ads">
                            <table class="w3-table-all w3-tiny w3-margin-top">
                                <thead>
                                <tr>
                                    <th>Кабинет</th>
                                    <th>Описание</th>
                                    <th>Расходы</th>
                                     <th>Конверсий</th>
                                     <th>Цена конверсии</th>
                                     <th>Кликов</th>
                                     <th>Показов</th>
                                     <th>ID кабинета</th>
                                 </tr>
                                </thead>
                                <tbody class="ttt-adsets-list">

                                </tbody>
                            </table>
                        </div>

                </div>

                <div id="ttt_plugin_tab3" class="w3-container ttt-tab-body w3-padding-16" style="display:none">
<!--                    <button class="w3-button w3-margin-bottom w3-medium w3-green ttt_auth">Авторизовать аккаунт</button>-->
                    <button class="w3-button w3-margin-bottom w3-medium w3-yellow ttt_open_pixel">Открыть Pixel</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-blue ttt_activate_disabled">Включить кнопки</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-blue ttt_create_pixel">Создать пиксель</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-blue ttt_campaigns_on">Включить все кампании</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-blue ttt_ads_on">Включить все адсеты с конверсиями</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-red ttt_campaigns_off">Выключить все кампании</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-red ttt_ads_in_mod_delete">Удалить адсеты на модерации</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-red ttt_campaigns_delete">Удалить кампании</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-red ttt_free_creos_delete">Удалить непривязанные креативы</button>
                    <button class="w3-button w3-margin-bottom w3-medium w3-red ttt_creos_delete">Удалить все креативы</button>



<!--                    <div class="ttt_checkZaliv" style="background: rgba(3,3,3,0.3);">-->

<!--                        <select name="ttt_checkZaliv_country" id="ttt_country" class="w3-select ttt_input_field" style="width: 230px;">-->
<!--                        <option value="3865483">Argentina</option>-->
<!--                        <option value="2077456">Australia</option>-->
<!--                        <option value="2782113">Austria</option>-->
<!--                        <option value="290291">Bahrain</option>-->
<!--                        <option value="630336">Belarus</option>-->
<!--                        <option value="2802361">Belgium</option>-->
<!--                        <option value="3469034">Brazil</option>-->
<!--                        <option value="1831722">Cambodia</option>-->
<!--                        <option value="6251999">Canada</option>-->
<!--                        <option value="3895114">Chile</option>-->
<!--                        <option value="3686110">Colombia</option>-->
<!--                        <option value="3077311">Czechia</option>-->
<!--                        <option value="2623032">Denmark</option>-->
<!--                        <option value="357994">Egypt</option>-->
<!--                        <option value="660013">Finland</option>-->
<!--                        <option value="3017382">France</option>-->
<!--                        <option value="2921044">Germany</option>-->
<!--                        <option value="390903">Greece</option>-->
<!--                        <option value="719819">Hungary</option>-->
<!--                        <option value="1269750">India</option>-->
<!--                        <option value="1643084">Indonesia</option>-->
<!--                        <option value="2963597">Ireland</option>-->
<!--                        <option value="294640">Israel</option>-->
<!--                        <option value="3175395">Italy</option>-->
<!--                        <option value="1861060">Japan</option>-->
<!--                        <option value="248816">Jordan</option>-->
<!--                        <option value="1522867">Kazakhstan</option>-->
<!--                        <option value="1835841">Korea</option>-->
<!--                        <option value="285570">Kuwait</option>-->
<!--                        <option value="1733045">Malaysia</option>-->
<!--                        <option value="3996063">Mexico</option>-->
<!--                        <option value="2542007">Morocco</option>-->
<!--                        <option value="2750405">Netherlands</option>-->
<!--                        <option value="2186224">New Zealand</option>-->
<!--                        <option value="3144096">Norway</option>-->
<!--                        <option value="286963">Oman</option>-->
<!--                        <option value="1168579">Pakistan</option>-->
<!--                        <option value="3932488">Peru</option>-->
<!--                        <option value="1694008">Philippines</option>-->
<!--                        <option value="798544">Poland</option>-->
<!--                        <option value="2264397">Portugal</option>-->
<!--                        <option value="289688">Qatar</option>-->
<!--                        <option value="798549">Romania</option>-->
<!--                        <option value="2017370">Russia</option>-->
<!--                        <option value="102358">Saudi Arabia</option>-->
<!--                        <option value="1880251">Singapore</option>-->
<!--                        <option value="953987">South Africa</option>-->
<!--                        <option value="2510769">Spain</option>-->
<!--                        <option value="2661886">Sweden</option>-->
<!--                        <option value="2658434">Switzerland</option>-->
<!--                        <option value="1668284">Taiwan</option>-->
<!--                        <option value="1605651">Thailand</option>-->
<!--                        <option value="298795">Turkey</option>-->
<!--                        <option value="690791">Ukraine</option>-->
<!--                        <option value="290557">United Arab Emirates</option>-->
<!--                        <option value="2635167">United Kingdom</option>-->
<!--                        <option value="6252001">United States</option>-->
<!--                        <option value="1562822">Vietnam</option>-->
<!--                        </select>-->

<!--                        <div class="w3-third w3-margin-top" style="margin: 10px !important;">-->
<!--                            <input class="ttt_input_field w3-input w3-border-0" type="text" name="ttt_checkZaliv_link"-->
<!--                                placeholder="https://tabatashop2.ru/YTq1hpbPzz">-->
<!--                        </div>-->

<!--                        <button class="w3-button w3-margin-bottom w3-medium w3-blue ttt_checkZaliv_button" style="margin: 10px !important;">Залить природу</button>-->
<!--                    </div>-->
                </div>


            </div>
        </div>
    </div>`;

        divTimer = document.querySelector('.ttt-timer');
        divActiveAd = document.querySelector('.ttt-adsets-list')
        // divLogs = document.querySelector('.ttt_logs');
        // deletedTable = document.querySelector('.ttt-deleted-list')
        document.getElementById('ttt_ext-tt_addAccountBtn').addEventListener("click", addAccountToList);

    }


    async function addAccountToList(ev) {
        ev.preventDefault();
        let accId = document.getElementById('ttt_ext-tt_accountForAdd').value;
        let accDesc = document.getElementById('ttt_ext-tt_accountDesc').value;
        let accName, accStatus;

        await fetch(`https://ads.tiktok.com/api/v3/i18n/account/permission/detail/?aadvid=${accId}`).then(res => res.json())
            .then(res => {
                if (res.msg == 'success') {
                    accName = res.data.account.name;
                    accStatus = res.data.account.status; //4ok 8ban
                }
                console.log(res)
            });

        if (accName && accStatus) {
            let accountInfo = document.createElement('div');
            let status;
            if (accStatus == 4)
                status = 'Активен';
            else if (accStatus == 8)
                status = 'Забанен';
            let descr = accDesc ? ` (${accDesc})` : '';
            accountInfo.innerHTML = `${accName}${descr} - ${accId}: ${status}`;

            document.querySelector('.ttt_accountListDiv_list').appendChild(accountInfo);

            accounts.push({
                "accountName": accName,
                "accountID": accId,
                "accountDesc": accDesc,
                "accountStatus": status,
            });

            document.getElementById('ttt_ext-tt_accountForAdd').value = '';
            document.getElementById('ttt_ext-tt_accountDesc').value = '';
        } else {
            alert('Ошибка. Проверь��е правильность ID кабинета.');
        }
    }

    var check_time;
    async function getActiveAdGroups() {
        let htmlAllAd = "";
        check_time = Number(document.getElementById("check_time").value);
        console.log("Проверка за : "+check_time+" дня");
        timezone= await getzone();
        let nowDate = new Date()
        let tomorrow = new Date(nowDate)
        tomorrow.setDate(nowDate.getDate() - check_time)
        let todayDate = tomorrow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(0);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        for (let i = 0; i < accounts.length; i++) {
            const accID = accounts[i];
            console.log(accID.accountID)
            console.log(csrfToken)
            let allActiveAds = await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/campaign/list/?aadvid=${accID.accountID}`, { //accID.accountID
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "lifetime": 0,
                    "st": "" + todayDate + "",
                    "et": "" + tommorowDate + "",
                    "query_list": ["stat_cost",
                        "cpc",
                        "cpm",
                        "show_cnt",
                        "click_cnt",
                        "ctr",
                        "time_attr_convert_cnt",
                        "time_attr_conversion_cost",
                        "time_attr_conversion_rate",
                        "time_attr_effect_cnt",
                        "time_attr_effect_cost",
                        "time_attr_effect_rate",
                        "campaign_id"]
                }),
                "method": "POST",
            }).then(res => res.json());


            htmlAllAd += `<tr>
            <td>${accID.accountName}</td>
            <td>${accID.accountDesc}</td>
            <td>$${allActiveAds.data.statistics.stat_cost}</td>
            <td>${allActiveAds.data.statistics.time_attr_convert_cnt}</td>
            <td>$${allActiveAds.data.statistics.time_attr_conversion_cost}</td>
            <td>${allActiveAds.data.statistics.click_cnt}</td>
            <td>${allActiveAds.data.statistics.show_cnt}</td>
            <td>${accID.accountID}</td>
        </tr>`;

        }




        divActiveAd.innerHTML = htmlAllAd;
    }

    function timer() {

        tick = tick + 1;
        divTimer.innerHTML = (MINS + 1 - tick) + " мин";

    }

    async function intervalFunc() {
        await updateAccountsStatus();
        await getActiveAdGroups();

        console.time('В� ЕМЯ П� ОВЕ� КИ ------------------------- ');

        for (let i = 0; i < accounts.length; i++) {
            if(accounts[i].accountStatus == 8) continue;

            const accID = accounts[i].accountID;

            if( autorulesOptions.offAdsets ) {
                await checkAdAllTime(accID);
            }
        }

        for (let i = 0; i < accounts.length; i++) {
            if(accounts[i].accountStatus == 8) continue;

            const accID = accounts[i].accountID;

            if( autorulesOptions.offCampaigns ) {
                checkCampaignCost(accID);
            }

            if( autorulesOptions.returnAdsets || autorulesOptions.delBanAdsets) {
                offBlock(accID);
            }

            if( autorulesOptions.onMathAdsets ) {
                returnMathAdsets(accID);
            }
        }

        if(counterOfCheck%3 == 0) {
            for (let i = 0; i < accounts.length; i++) {
                if(accounts[i].accountStatus == 8) continue;

                const accID = accounts[i].accountID;

                if( autorulesOptions.makeAdsetDubl ) {
                    makeDublLeadAdset(accID);
                }

                if( autorulesOptions.makeAdsetDublNewCampaign ) {
                    checkDubl2NewCampaign(accID);
                }
            }
        }

        console.timeEnd('В� ЕМЯ П� ОВЕ� КИ ------------------------- ');

        tick = 0;
        counterOfCheck = counterOfCheck + 1;
        console.log('counterOfCheck:', counterOfCheck);
    }


    async function updateAccountsStatus()  {
        document.querySelector('.ttt_accountListDiv_list').innerHTML = '';

        for (let i = 0; i < accounts.length; i++) {
            let accId = accounts[i].accountID;
            let accName = accounts[i].accountName;
            let accDesc = accounts[i].accountDesc;

            await fetch(`https://ads.tiktok.com/api/v3/i18n/account/permission/detail/?aadvid=${accId}`).then(res => res.json())
                .then(res => {
                    let accStatus = res.data.account.status; //4ok 8ban
                    accounts[i].accountStatus = accStatus;

                    let accountInfo = document.createElement('div');
                    let status;
                    if (accStatus == 4)
                        status = 'Активен';
                    else if (accStatus == 8)
                        status = 'Забанен';
                    accountInfo.innerHTML = `${accName} (${accDesc}) - ${accId}: ${status}`;

                    document.querySelector('.ttt_accountListDiv_list').appendChild(accountInfo);
                });

        }
    }


    let elemntsOfOptions = {};
    function getOptions() {

        elemntsOfOptions.offAdsets = document.querySelector('#off_adgroups');
        elemntsOfOptions.offCampaigns = document.querySelector('#off_campaigns');

        elemntsOfOptions.returnAdsets = document.querySelector("#return_adgroups");
        elemntsOfOptions.returnOption = document.querySelector("#retSel");

        elemntsOfOptions.delBanAdsets = document.querySelector('#delete_adgroups');

        elemntsOfOptions.makeAdsetDubl = document.querySelector('#double_adsets');
        elemntsOfOptions.makeAdsetDublCountOfCnv = document.querySelector('#double_adsetsLeads');
        elemntsOfOptions.makeAdsetDublCountOfDubl = document.querySelector('#double_adsetsCopy');


        elemntsOfOptions.makeAdsetDublNewCampaign = document.querySelector('#double_adsetsCamp');
        elemntsOfOptions.makeAdsetDublNewCampaignCountOfCnv = document.querySelector('#double_adsetsCampLeads');
        elemntsOfOptions.makeAdsetDublNewCampaignCountOfDubl = document.querySelector('#double_adsetsCampCopy');

        let makeAdsetDublCountOfCnv = Math.round(Number(elemntsOfOptions.makeAdsetDublCountOfCnv.value));
        if(makeAdsetDublCountOfCnv == 0) {
            elemntsOfOptions.makeAdsetDublCountOfCnv.value = 1;
            makeAdsetDublCountOfCnv = 1;
        }

        let makeAdsetDublCountOfDubl = Math.round(Number(elemntsOfOptions.makeAdsetDublCountOfDubl.value));
        if(makeAdsetDublCountOfDubl == 0) {
            elemntsOfOptions.makeAdsetDublCountOfDubl.value = 1;
            makeAdsetDublCountOfDubl = 1;
        }

        let makeAdsetDublNewCampaignCountOfCnv = Math.round(Number(elemntsOfOptions.makeAdsetDublNewCampaignCountOfCnv.value));
        if(makeAdsetDublNewCampaignCountOfCnv == 0) {
            elemntsOfOptions.makeAdsetDublNewCampaignCountOfCnv.value = 1;
            makeAdsetDublNewCampaignCountOfCnv = 1;
        }

        let makeAdsetDublNewCampaignCountOfDubl = Math.round(Number(elemntsOfOptions.makeAdsetDublNewCampaignCountOfDubl.value));
        if(makeAdsetDublNewCampaignCountOfDubl == 0) {
            elemntsOfOptions.makeAdsetDublNewCampaignCountOfDubl.value = 1;
            makeAdsetDublNewCampaignCountOfDubl = 1;
        }

        let onMathAdsets = true;

        autorulesOptions = {
            'offAdsets': elemntsOfOptions.offAdsets.checked,
            'offCampaigns': elemntsOfOptions.offCampaigns.checked,

            'returnAdsets': elemntsOfOptions.returnAdsets.checked,
            'returnOption': elemntsOfOptions.returnOption.value,

            'delBanAdsets': elemntsOfOptions.delBanAdsets.checked,

            'makeAdsetDubl': elemntsOfOptions.makeAdsetDubl.checked,
            'makeAdsetDublCountOfCnv': makeAdsetDublCountOfCnv,
            'makeAdsetDublCountOfDubl': makeAdsetDublCountOfDubl,

            'makeAdsetDublNewCampaign': elemntsOfOptions.makeAdsetDublNewCampaign.checked,
            'makeAdsetDublNewCampaignCountOfCnv': makeAdsetDublNewCampaignCountOfCnv,
            'makeAdsetDublNewCampaignCountOfDubl': makeAdsetDublNewCampaignCountOfDubl,

            'onMathAdsets': onMathAdsets,
        };

        let els = Object.values(elemntsOfOptions);
        els.forEach(el => {
            try { if (el) el.disabled = true; } catch (e) {}
        });

        console.log(autorulesOptions);
    }

    function clearOptions() {
        let els = Object.values(elemntsOfOptions);
        els.forEach(el => {
            el.disabled = false;
        });
        document.querySelector("#retSel").disabled = true;
    }


    function startBtn() {
        console.log('старт');

        if(accounts.length == 0) {
            accounts.push(accountID);
        }

        getOptions();

        updateAccountsStatus()
        getActiveAdGroups();

        startInterval();
        tick = 0;
        timer();
        startTimerInterval();
    }

    function stopBtn() {
        clearInterval(interval);
        clearInterval(timerInterval);
        clearOptions();
    }


//
    async function checkAdAllTime(accID) {
        console.time(`${accID}: перекрут адсетов`);
        timezone= await getzone();
        console.log("Проверка за : "+check_time+" дня");
        timezone= await getzone();
        let nowDate = new Date()
        let tomorrow = new Date(nowDate)
        tomorrow.setDate(nowDate.getDate() - check_time)
        let todayDate = tomorrow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(0);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        let pages;
        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "st": "" + todayDate + "",
                "et": "" + tommorowDate + "",
                "ad_status": ["delivery_ok"],
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "having_filter": [{
                    "filter_type": 8,
                    "field": "stat_cost",
                    "upper": "",
                    "lower": "0.30"
                }],
                "query_list": [
                    "stat_cost",
                    "time_attr_conversion_cost",
                    "time_attr_convert_cnt",
                    "cpm",
                    "ctr",
                    "show_cnt",
                    "click_cnt",
                    "cpc",
                    "time_attr_conversion_rate",
                    "time_attr_effect_rate",
                    "campaign_id"]
            }),
            "method": "POST",
        })
            .then(res => res.json())
            .then(res => {
                pages = res.data.pagination.page_count;
                let data = res.data.table;

                for (let key in data) {
                    if (!data[key].ad_name.includes('[')) continue;

                    let id = data[key].ad_id; //str
                    let name = data[key].ad_name; //str
                    let bid = data[key].bid; //str
                    let cpa = data[key].stat_data.time_attr_conversion_cost; //num
                    let conversion = data[key].stat_data.time_attr_convert_cnt; //num
                    let viewAll = data[key].stat_data.show_cnt; //num
                    let cost = data[key].stat_data.stat_cost; //num

                    let price = name.indexOf('[') == -1 ? 1000 : Number(
                        name.slice(name.indexOf('[') + 1, name.indexOf(']'))
                    );

                    console.log(`${name}: [${price}] [CNV:${conversion}, CPA:${cpa}, COST:${cost}]` );

                    if (
                        (conversion == 0 && cost > price * 0.7) ||
                        (conversion == 1 && cost > price * 1.7) ||
                        (conversion > 1 && (cost - price) / conversion > price * 1.15)
                    ) {
                        // console.log("OFFadGroup "+ todayDate)
                        // console.log(tomorrowDate)
                        OFFadGroup(id, name, `[CNV:${conversion}, CPA:${cpa}, COST:${cost}]`, accID);
                    }
                }
            });


        for (let i = 2; i <= pages; i++) {
            await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "st": "" + todayDate + "",
                    "et": "" + tommorowDate + "",
                    "ad_status": ["delivery_ok"],
                    "sort_stat": "stat_cost",
                    "sort_order": 1,
                    "page": i,
                    "limit": 50,
                    "having_filter": [{
                        "filter_type": 8,
                        "field": "stat_cost",
                        "upper": "",
                        "lower": "0.30"
                    }],
                    "query_list": [
                        "stat_cost",
                        "time_attr_conversion_cost",
                        "time_attr_convert_cnt",
                        "cpm",
                        "ctr",
                        "show_cnt",
                        "click_cnt",
                        "cpc",
                        "time_attr_conversion_rate",
                        "time_attr_effect_rate",
                        "campaign_id"]
                }),
                "method": "POST",
            })
                .then(res => res.json())
                .then(res => {
                    let data = res.data.table;

                    for (let key in data) {
                        if (!data[key].ad_name.includes('[')) continue;

                        let id = data[key].ad_id; //str
                        let name = data[key].ad_name; //str
                        let bid = data[key].bid; //str
                        let cpa = data[key].stat_data.time_attr_conversion_cost; //num
                        let conversion = data[key].stat_data.time_attr_convert_cnt; //num
                        let viewAll = data[key].stat_data.show_cnt; //num
                        let cost = data[key].stat_data.stat_cost; //num

                        let price = name.indexOf('[') == -1 ? 1000 : Number(
                            name.slice(name.indexOf('[') + 1, name.indexOf(']'))
                        );

                        if (
                            (conversion == 0 && cost > price * 0.7) ||
                            (conversion == 1 && cost > price * 1.7) ||
                            (conversion > 1 && (cost - price) / conversion > price * 1.15)
                        ) {
                            // console.log("OFFadGroup "+ todayDate)
                            // console.log(tomorrowDate)
                            OFFadGroup(id, name, `[CNV:${conversion}, CPA:${cpa}, COST:${cost}]`, accID);
                        }
                    }
                });
        }

        console.timeEnd(`${accID}: перекрут адсетов`);
    }
    async function OFFadGroup(id, name, msg, accID) {
        console.log(id+" "+ name+"")
        fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": `${csrfToken}`
            },
            "body": `ad_list=%5B%22${id}%22%5D&operation=disable`,
            "method": "POST",
        }).then(res => res.json())
            .then(data => {
                if (data.msg == "success") {
                    logger(`<span class="ext-tt_log-off">[SUCCESS OFF] ${name} - ${msg}</span>`);
                } else {
                    logger(`<span class="ext-tt_log-error">[ERROR OFF] ${name} - ${msg}</span>`);
                }
            });
    }


    function logger(msg) {
        // let nowDate = new Date();
        // let time = nowDate.toLocaleTimeString([], {
        //     hour: '2-digit',
        //     minute: '2-digit'
        // });

        // let span = document.createElement('span');
        // span.innerHTML = `<span>${time} </span>${msg}</br>`
        // divLogs.insertAdjacentElement('afterbegin', span);
        // divLogs.innerHTML += `<span>${time} </span>${msg}</br>`;

        console.log(msg);

    }





//////////////// OFF DISABLE ADSETS


    async function offBlock(accID) {
        let allIdsForOff = [];
        let allIdsForReload = [];

        console.time(`${accID}: восстановление`);
        let pages;

        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "lifetime": 1,
                "st": "",
                "et": "",
                "ad_status": ["not_delivery"],
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "query_list": [
                    "stat_cost",
                    "time_attr_conversion_cost",
                    "time_attr_convert_cnt",
                    "cpm",
                    "ctr",
                    "show_cnt",
                    "click_cnt",
                    "cpc",
                    "time_attr_conversion_rate",
                    "time_attr_effect_rate",
                    "frequency"
                ]
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            pages = res.data.pagination.page_count;

            for (let i = 0; i < res.data.table.length; i++) {
                if (res.data.table[i].ad_status == "ad_offline_audit") {

                    if(autorulesOptions.returnAdsets) {

                        if (autorulesOptions.returnOption == 'every') allIdsForReload.push(res.data.table[i].ad_id);
                        else if (autorulesOptions.returnOption == 'show' && res.data.table[i].stat_data.show_cnt > 0)
                        {allIdsForReload.push(res.data.table[i].ad_id);}
                        else if (autorulesOptions.returnOption == 'click' && res.data.table[i].stat_data.click_cnt > 0)
                        {allIdsForReload.push(res.data.table[i].ad_id);}
                        else if (autorulesOptions.returnOption == 'cnv' && res.data.table[i].stat_data.time_attr_convert_cnt > 0)
                        {allIdsForReload.push(res.data.table[i].ad_id);}
                        else {
                            // deletedTable.innerHTML += `
                            //     <td>${res.data.table[i].campaign_name}</td>
                            //     <td>${res.data.table[i].ad_name}</td>
                            // `;
                            allIdsForOff.push(res.data.table[i].ad_id);
                        }

                    } else {
                        allIdsForOff.push(res.data.table[i].ad_id);
                    }




                }
            }
        });


        console.log('autorulesOptions.returnOption:', autorulesOptions.returnOption);
        console.log('777:', allIdsForReload);



        for (let i = 2; i <= pages; i++) {

            await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "lifetime": 1,
                    "st": "",
                    "et": "",
                    "ad_status": ["not_delivery"],
                    "sort_stat": "stat_cost",
                    "sort_order": 1,
                    "page": i,
                    "limit": 50,
                    "query_list": [
                        "stat_cost",
                        "time_attr_conversion_cost",
                        "time_attr_convert_cnt",
                        "cpm",
                        "ctr",
                        "show_cnt",
                        "click_cnt",
                        "cpc",
                        "time_attr_conversion_rate",
                        "time_attr_effect_rate",
                        "frequency"
                    ]
                }),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                for (let i = 0; i < res.data.table.length; i++) {
                    if (res.data.table[i].ad_status == "ad_offline_audit") {

                        if(autorulesOptions.returnAdsets) {

                            if (autorulesOptions.returnOption == 'every') allIdsForReload.push(res.data.table[i].ad_id);
                            else if (autorulesOptions.returnOption == 'show' && res.data.table[i].stat_data.show_cnt > 0) allIdsForReload.push(res.data.table[i].ad_id);
                            else if (autorulesOptions.returnOption == 'click' && res.data.table[i].stat_data.click_cnt > 0) allIdsForReload.push(res.data.table[i].ad_id);
                            else if (autorulesOptions.returnOption == 'cnv' && res.data.table[i].stat_data.time_attr_convert_cnt > 0) allIdsForReload.push(res.data.table[i].ad_id);
                            else {
                                // deletedTable.innerHTML += `
                                //     <td>${res.data.table[i].campaign_name}</td>
                                //     <td>${res.data.table[i].ad_name}</td>
                                // `;
                                allIdsForOff.push(res.data.table[i].ad_id);
                            }

                        } else {
                            allIdsForOff.push(res.data.table[i].ad_id);
                        }

                    }
                }
            });

        }


        if(autorulesOptions.returnAdsets) {
            for (let i = 0; i < allIdsForReload.length; i++) {
                returnBlockAdset(allIdsForReload[i], accID);
            }
        }

        if(autorulesOptions.delBanAdsets) {
            for (let i = 0; i < allIdsForOff.length; i++) {
                DeletaAdset(allIdsForOff[i], accID);
            }
        }

        allIdsForReload = [];
        allIdsForOff = [];

        console.timeEnd(`${accID}: восстановление`);
    }

    async function returnBlockAdset(id, accID) {

        let track_url, action_track_url, source, image_list, title_list, call_to_action_list, avatar_icon, identity_id, external_url, newUrl, call_to_action_id, objective_type, creative_name;

        await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/ad/detail/?aadvid=${accID}&req_src=ad_creation&ad_id=${id}`)
            .then(res => res.json())
            .then(res => {
                let rand = new Date().getTime().toString();

                source = res.data.source;
                image_list = res.data.image_list;
                title_list = res.data.title_list;
                call_to_action_list = res.data.advanced_creative.length > 0 ? res.data.advanced_creative : res.data.call_to_action_list;
                call_to_action_id = res.data.call_to_action_id;
                avatar_icon = res.data.avatar_icon;
                identity_id = res.data.identity_id;
                external_url = res.data.external_url;
                objective_type = res.data.objective_type;
                action_track_url = res.data.action_track_url;
                track_url = res.data.track_url;
                newUrl = res.data.external_url + "&creo=" + rand;
                creative_name = res.data.creative_name;
            });

        if (objective_type == 2) {
            // Меняем кнопку, если это приложение
            const appsCallToActions = [
                'download_now',
                'learn_more',
                'install_now'
            ]
            let existingActions = []
            for (let i = 0; i < call_to_action_list.length; i++) {
                existingActions.push(array[i].call_to_action)
            }
            const notAcrosses = appsCallToActions.filter(item => {
                return !existingActions.includes(item)
            })
            if (acrosses.length == 3) {
                call_to_action_list.pop()
            } else {
                call_to_action_list[0] = {
                    call_to_action: notAcrosses[0]
                }
            }
            // Меняем кнопку, если это приложение
        }

        let mainData = {
            "ad_ids": [
                `${id}`
            ],
            "inventory_flow": [
                3000
            ],
            "inventory_flow_type": 1,
            "objective_type": objective_type,
            "creative_material_mode": 3,//3
            "playable_url": "",
            "coming_source_type": 6, //// was 6 ---- 2
            "creative_name": creative_name,
            "app_name": "",
            "source": source,
            "identity_id": identity_id,
            "item_source": 0,
            "image_list": image_list, ///
            "title_list": title_list,
            "page_list": [],
            "card_list": [],
            "advanced_creative": [],
            "call_to_action_list": call_to_action_list,
            "call_to_action_id": call_to_action_id,
            "avatar_icon": avatar_icon,
            "identity_type": 1,
            "open_url": newUrl,
            "is_open_url": 0,
            "auto_open": 0,
            "external_url": external_url,
            "external_url_domain": "",
            "fallback_type": 0,
            "is_creative_authorized": false,
            "is_presented_video": 0,
            "agr_task_ids": [],
            "track_url": [],
            "action_track_url": [],
            "vast_moat": 0,
            "vast_double_verify": 0,
            "vast_ias": false,
            "vast_url": "",
            "tracking_pixel_id": pixelId,
            "tracking_app_id": "0",
            "tracking_offline_event_set_ids": [],
            "destination_url_type": "WEB_SITE",
            "attachment_creative_preview_url": "",
            "attachment_creative_type": 0,
            "card_id": "",
            "struct_version": 1
        };

        fetch(`https://ads.tiktok.com/api/v3/i18n/perf/creative/update/?aadvid=${accID}&req_src=ad_creation`, {
            "headers": {
                "content-type": "application/json",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify(mainData),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            if (res.msg == "success") {
                console.log("Return adset ", id, " success!");
            } else {
                console.log('ERROR Return adset ', id);
            }
        });
    }

    function OffAdset(id, accID) {

        fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": `${csrfToken}`
            },
            "body": `ad_list=%5B%22${id}%22%5D&operation=disable`,
            "method": "POST",
        }).then(res => res.json())
            .then(data => {
                if (data.msg == "success") {
                    console.log(`[SUCCESS OFF] ${id}`);
                } else {
                    console.log(`[ERROR OFF] ${id}`);
                }

            });
    }

    function DeletaAdset(id, accID) {

        fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": `${csrfToken}`
            },
            "body": "ad_list=%5B%22" + id + "%22%5D&operation=delete",
            "method": "POST",
        }).then(res => res.json()).then(res => {
            console.log(`Delete adset: ${res.msg}`)
        });

        // let d = new Date();
        // let from = d.setMonth(d.getMonth() - 1);
        // let fromD = new Date(from);
        // let fromDString = fromD.toLocaleDateString('en-CA')
        // fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/material/list/?aadvid=${accountID}`, {
        //     "headers": {
        //         "content-type": "application/json",
        //         "x-csrftoken": `${csrfToken}`
        //     },
        //     "body": JSON.stringify({
        //         "m_type": 3,
        //         "metrics": [],
        //         "base_infos": ['creative_nums'],
        //         "is_lifetime": 0,
        //         "order_field": "create_time",
        //         "order_type": 1,
        //         "page": 1,
        //         "page_size": 50,
        //         "keyword": String(id),
        //         "keyword_type": 2,
        //         "country": [],
        //         "image_mode": [],
        //         "placement_id": [],
        //         "source": [],
        //         "st": fromDString,
        //         "cost_lower": "0",
        //         "cost_upper": "0",
        //         "conversion_lower": "0",
        //         "conversion_upper": "0"
        //     }),
        //     "method": "POST"
        // }).then(res => res.json()).then(res => {
        //     const materials = []
        //     res.data.material_infos.forEach(item => {
        //         materials.push(item.base_info.material_id)
        //     })
        //     fetch(`https://ads.tiktok.com/api/v3/i18n/material/video/delete/?aadvid=${accountID}`, {
        //         "headers": {
        //             "content-type": "application/json",
        //             "x-csrftoken": `${csrfToken}`
        //         },
        //         "body": JSON.stringify({
        //             ids: materials
        //         }),
        //         "method": "POST",
        //     });
        // });
    }


///////// dubl lead adset to self campaign
    async function makeDublLeadAdset(accID) {
        console.time(`${accID}: дубль адсет`);
        timezone= await getzone();
        let nowDate = new Date();
        let todayDate = nowDate.toLocaleDateString('en-CA', {
            timeZone: timezone//"Europe/Moscow"
        });
        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(24);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone//"Europe/Moscow"
        });

        let pgCounts = 1;

        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "st": "" + todayDate + "",
                "et": "" + tommorowDate + "",
                "ad_status": ["no_delete"],
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "having_filter" : [{
                    "filter_type": 8,
                    "field": "time_attr_convert_cnt",
                    "upper": "",
                    "lower": "1"
                }],
                "query_list": [
                    "stat_cost",
                    "time_attr_conversion_cost",
                    "time_attr_convert_cnt",
                    "cpm",
                    "ctr",
                    "show_cnt",
                    "click_cnt",
                    "cpc",
                    "time_attr_conversion_rate",
                    "time_attr_effect_rate",
                    "frequency"
                ]
            }),
            "method": "POST"
        }).then(res => res.json()).then(res => {

            pgCounts = res.data.pagination.page_count;

            for (let i = 0; i < res.data.table.length; i++) {
                if (res.data.table[i].stat_data.time_attr_convert_cnt >= autorulesOptions.makeAdsetDublCountOfCnv &&
                    !res.data.table[i].ad_name.includes('++')) {
                    for (let j = 1; j <= autorulesOptions.makeAdsetDublCountOfDubl; j++) {
                        makeDubl(res.data.table[i].ad_id, j, accID);
                    }

                }
            }
        });


        for (let i = 2; i <= pgCounts; i++) {
            await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "st": "" + todayDate + "",
                    "et": "" + tommorowDate + "",
                    "ad_status": ["no_delete"],
                    "sort_stat": "stat_cost",
                    "sort_order": 1,
                    "page": i,
                    "limit": 50,
                    "query_list": [
                        "stat_cost",
                        "time_attr_conversion_cost",
                        "time_attr_convert_cnt",
                        "cpm",
                        "ctr",
                        "show_cnt",
                        "click_cnt",
                        "cpc",
                        "time_attr_conversion_rate",
                        "time_attr_effect_rate",
                        "frequency"
                    ]
                }),
                "method": "POST"
            }).then(res => res.json()).then(res => {

                for (let i = 0; i < res.data.table.length; i++) {
                    if (res.data.table[i].stat_data.time_attr_convert_cnt >= autorulesOptions.makeAdsetDublCountOfCnv &&
                        !res.data.table[i].ad_name.includes('++')) {
                        for (let j = 1; j <= autorulesOptions.makeAdsetDublCountOfDubl; j++) {
                            makeDubl(res.data.table[i].ad_id, j, accID);
                        }

                    }
                }
            });

        }

        console.timeEnd(`${accID}: дубль адсет`);
    }


    async function makeDubl(asid, iter, accID) {
        timezone= await getzone();
        let nowDate = new Date();
        console.log(timezone)
        let startdate = `${nowDate.toLocaleDateString('en-CA',{timeZone:timezone})} ${nowDate.toLocaleTimeString('it-IT',{timeZone:timezone})}`;
        startdate = startdate.replaceAll('.', ':')
        console.log(startdate)
        let asidData;

        await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/ad/detail/?aadvid=${accID}&req_src=ad_creation&ad_id=${asid}`)
            .then(res => res.json().then(res => {
                asidData = res.data.base_info;
            }));

        let name = asidData.name;

        asidData.start_time = startdate;
        asidData.brand_safety = 1;
        asidData.brand_safety_partner = 0;
        asidData.name = asidData.name + "-" + iter;
        asidData.audit_status = 1;
        asidData.status = 0;


        let newadids;
        await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/ad/create/?aadvid=${accID}&req_src=ad_creation`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "batch_info": [],
                "base_info": asidData
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            newadids = res.data.ad_ids;
        });


        let adData;
        await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/creative/procedural_detail/?aadvid=${accID}&req_src=ad_creation&creative_id=${asid}&creative_material_mode=3`)
            .then(res => res.json()).then(res => {
                adData = res.data;
            });

        adData.ad_ids = newadids;
        adData.call_to_action_list = adData.advanced_creative;
        //adData.is_smart_creative = true;
        //adData.external_url = adData.external_url + "&copynumber=" + iter;

        await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/creative/create/?aadvid=${accID}&req_src=ad_creation`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify(adData),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            console.log(res.msg);
        });
    }




/////// dubl to new campaign
    async function checkDubl2NewCampaign(accID) {
        console.time(`${accID}: дубль кампания`);
        timezone= await getzone();
        let nowDate = new Date();
        let todayDate = nowDate.toLocaleDateString('en-CA', {
            timeZone: timezone//"Europe/Moscow"
        });
        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(24);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone//"Europe/Moscow"
        });

        let pgCounts = 1;

        let allCname = [];
        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/campaign/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },

            "body": JSON.stringify({
                "lifetime": 1,
                "st": "",
                "et": "",
                "keyword": "",
                "search_type": 1,
                "campaign_status": ["no_delete"],
                "version": 1,
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "query_list": ["stat_cost",
                    "cpc",
                    "cpm",
                    "show_cnt",
                    "click_cnt",
                    "ctr",
                    "time_attr_convert_cnt",
                    "skan_convert_cnt",
                    "time_attr_conversion_cost",
                    "skan_conversion_cost",
                    "time_attr_conversion_rate",
                    "skan_conversion_rate",
                    "time_attr_effect_cnt",
                    "time_attr_effect_cost",
                    "time_attr_effect_rate"
                ]
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            res.data.table.forEach(item => {
                allCname.push(item.campaign_name);
            })
        });

        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "st": todayDate,
                "et": tommorowDate,
                "ad_status": ["no_delete"],
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "having_filter": [{
                    "filter_type": 8,
                    "field": "time_attr_convert_cnt",
                    "upper": "",
                    "lower": "1"
                }],
                "query_list": [
                    "stat_cost",
                    "time_attr_conversion_cost",
                    "time_attr_convert_cnt",
                    "cpm",
                    "ctr",
                    "show_cnt",
                    "click_cnt",
                    "cpc",
                    "time_attr_conversion_rate",
                    "time_attr_effect_rate",
                    "frequency"
                ]
            }),
            "method": "POST"
        }).then(res => res.json()).then(res => {

            pgCounts = res.data.pagination.page_count;

            for (let i = 0; i < res.data.table.length; i++) {
                let convs = res.data.table[i].stat_data.time_attr_convert_cnt;
                let adsetid = res.data.table[i].ad_id;

                if (convs >= autorulesOptions.makeAdsetDublNewCampaignCountOfCnv &&
                    !allCname.find(arrItem => arrItem.includes(`${adsetid}`))) {
                    createCampaign4Dubl(res.data.table[i].campaign_name, adsetid, accID)
                }
            }
        });

        console.timeEnd(`${accID}: дубль кампания`);
    }

    async function createCampaign4Dubl(cname, asid, accID) {
        let campignid;

        let newCampaignDataJSON = {
            "struct_version": 1,
            "coming_source_type": 1,
            "app_id": "",
            "campaign_name": cname + ' - ' + asid,
            "ecomm_type": 0,
            "roas_bid": 0,
            "objective_type": 3,
            // === ДОДАЙТЕ АБО ОНОВІТЬ ЦІ КЛЮЧОВІ ПОЛЯ SMART+ ===
            "redesign_campaign_type": 1,
            "spc_automation_type": 1, // Вказує на Smart+
            "spc_upgrade_mode": 0,
            "spc_multi_ad_mode": 0,
            "sales_destination": 3,
            "universal_type": 1,
            "coming_source_type": 1,

            // Тимчасові ID, які потрібні API для контексту
            "campaign_snap_id": "1843100412825650",
            "campaign_draft_id": "1843100412826626",
            "rf_campaign_type": 0,
            "industry_types": [],
            "universal_type": 0,
            "campaign_app_profile_page_type": 0,
            "budget_mode": -1,
            "buying_type": 1,
            "dedicate_type": 1,
            "ab_test": 0,
            "app_campaign_type": 0,
            "onelink_url": "",
            "redesign_campaign_type": 1,
            "onelink_type": 0,
            "plan_version_type": 0,
            "budget_optimize_switch": 0,
            "ad_channel": 1,
            "budget": ""
        }

        await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/campaign/create/?aadvid=${accID}&req_src=ad_creation`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify(newCampaignDataJSON),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            campignid = res.data.campaign_id
        });


        for (let i = 1; i <= autorulesOptions.makeAdsetDublNewCampaignCountOfDubl; i++) {
            console.log(campignid, asid, i, accID)
            makeDubl2NewCampaign(campignid, asid, i, accID)
        }
    }

    async function makeDubl2NewCampaign(cid, asid, iter, accID) {
        try {
            timezone = await getzone();
            let nowDate = new Date();
            console.log("makeDubl2NewCampaign")
            let startdate = `${nowDate.toLocaleDateString('en-CA', {timeZone: timezone})} ${nowDate.toLocaleTimeString('it-IT', {timeZone: timezone})}`;
            startdate = startdate.replaceAll('.', ':')
            console.log(startdate)
            let asidData;

            await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/ad/detail/?aadvid=${accID}&req_src=ad_creation&ad_id=${asid}`)
                .then(res => res.json().then(res => {
                    asidData = res.data.base_info;
                }));

            asidData.start_time = startdate;
            asidData.brand_safety = 1;
            asidData.brand_safety_partner = 0;
            asidData.name = asidData.name.replaceAll('++', '') + "-" + iter;
            asidData.audit_status = 1;
            asidData.status = 0;
            asidData.campaign_id = cid;
            asidData.is_smart_creative = true;


            let newadids;
            await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/ad/create/?aadvid=${accID}&req_src=ad_creation`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify(adsetJson),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                console.log(res)
                newadids = res.data.ad_ids;
            });


            let adData;
            await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/creative/procedural_detail/?aadvid=${accID}&req_src=ad_creation&creative_id=${asid}&creative_material_mode=3`)
                .then(res => res.json()).then(res => {
                    adData = res.data;
                });

            adData.ad_ids = newadids;
            adData.call_to_action_list = adData.advanced_creative;
            //adData.is_smart_creative = true;
            //adData.external_url = adData.external_url + "&copynumber=" + iter;

            await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/creative/create/?aadvid=${accID}&req_src=ad_creation`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify(adData),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                console.log(res.msg);
            });
        }catch (e) {
            console.log(e)
        }
    }





///turnoff campaign



    async function checkCampaignCost(accID) {
        timezone= await getzone();
        console.time(`${accID}: перекрут кампаний`);
        console.log("Проверка за : "+check_time+" дня");
        timezone= await getzone();
        let nowDate = new Date()
        let tomorrow = new Date(nowDate)
        tomorrow.setDate(nowDate.getDate() - check_time)
        let todayDate = tomorrow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(0);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        let allCampaigns = [];


        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/campaign/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },

            "body": JSON.stringify({
                "lifetime": 0,
                "st": todayDate,
                "et": tommorowDate,
                "keyword": "",
                "search_type": 1,
                "campaign_status": ["no_delete"],
                "version": 1,
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "query_list": ["stat_cost",
                    "cpc",
                    "cpm",
                    "show_cnt",
                    "click_cnt",
                    "ctr",
                    "time_attr_convert_cnt",
                    "skan_convert_cnt",
                    "time_attr_conversion_cost",
                    "skan_conversion_cost",
                    "time_attr_conversion_rate",
                    "skan_conversion_rate",
                    "time_attr_effect_cnt",
                    "time_attr_effect_cost",
                    "time_attr_effect_rate"
                ]
            }),
            "method": "POST",
        }).then(res => res.json())
            .then(async function (res) {
                res.data.table.forEach(item => {
                    allCampaigns.push({
                        campaign_name: item.campaign_name,
                        campaign_id: item.campaign_id,
                        stat_cost: item.stat_data.stat_cost,
                        time_attr_conversion_cost: item.stat_data.time_attr_conversion_cost,
                        time_attr_convert_cnt: item.stat_data.time_attr_convert_cnt
                    })
                })
            });


        allCampaigns.forEach(item => {
            checkCampaignItem(item, accID);
        })


        console.timeEnd(`${accID}: перекрут кампаний`);
    }

    async function checkCampaignItem(item, accID) {

        if (item.campaign_name.includes('ZZZ')) return;

        let price;
        timezone= await getzone();
        console.log("Проверка за : "+check_time+" дня");
        timezone= await getzone();
        let nowDate = new Date()
        let tomorrow = new Date(nowDate)
        tomorrow.setDate(nowDate.getDate() - check_time)
        let todayDate = tomorrow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(0);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone
        });

        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "lifetime": 0,
                "st": todayDate,
                "et": tommorowDate,
                "search_type": 1,
                "ad_status": ["no_delete"],
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "campaign_ids": [item.campaign_id],
                "page": 1,
                "limit": 20,
                "query_list": ["stat_cost",
                    "cpc",
                    "cpm",
                    "show_cnt",
                    "click_cnt",
                    "ctr",
                    "time_attr_convert_cnt",
                    "skan_convert_cnt",
                    "time_attr_conversion_cost",
                    "skan_conversion_cost",
                    "time_attr_conversion_rate",
                    "skan_conversion_rate",
                    "time_attr_effect_cnt",
                    "time_attr_effect_cost",
                    "time_attr_effect_rate"
                ]
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            let name = res.data.table[0].ad_name;
            price = name.indexOf('[') == -1 ? NaN : Number(
                name.slice(name.indexOf('[') + 1, name.indexOf(']'))
            );
        });




        if ((price === NaN) ||
            (item.stat_cost > (price * 3) && item.time_attr_convert_cnt == 0) ||
            (item.stat_cost > (price * 4) && item.time_attr_conversion_cost > (price * 1.7))
        ) {
            console.log("turnOffCampaign "+ todayDate)
            console.log(tomorrowDate)
            turnOffCampaign(item.campaign_id, accID)
        }
    }

    function turnOffCampaign(id, accID) {

        fetch(`https://ads.tiktok.com/api/v2/i18n/overture/campaign/update_status/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": `${csrfToken}`
            },
            "body": `campaign_list=%5B%22${id}%22%5D&operation=disable`,
            "method": "POST",
        }).then(res => res.json())
            .then(data => {
                if (data.msg == "success") {
                    console.log(`[SUCCESS CAMPAIGN OFF] ${id}`);
                } else {
                    console.log(`[ERROR CAMPAIGN OFF] ${id} ${data.msg}`);
                }
            });
    }

    async function returnMathAdsets(accID) {
        console.time(`${accID}: возврат`);
        timezone= await getzone();
        let nowDate = new Date();
        let todayDate = nowDate.toLocaleDateString('en-CA', {
            timeZone: timezone//"Europe/Moscow"
        });
        let nowDateForTommorow = new Date();
        //nowDateForTommorow.setHours(24);
        let tommorowDate = nowDateForTommorow.toLocaleDateString('en-CA', {
            timeZone: timezone//"Europe/Moscow"
        });

        fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "st": "" + todayDate + "",
                "et": "" + tommorowDate + "",
                "ad_status": ["disable"],
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "having_filter": [{
                    "filter_type": 8,
                    "field": "time_attr_convert_cnt",
                    "upper": "",
                    "lower": "1"
                }],
                "query_list": [
                    "stat_cost",
                    "time_attr_conversion_cost",
                    "time_attr_convert_cnt",
                    "cpm",
                    "ctr",
                    "show_cnt",
                    "click_cnt",
                    "cpc",
                    "time_attr_conversion_rate",
                    "time_attr_effect_rate",
                    "frequency"
                ]
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            let adsets = res.data.table;

            adsets.forEach(el => {
                let id = el.ad_id;
                let name = el.ad_name;
                let cpa = el.stat_data.time_attr_conversion_cost;

                let price = name.indexOf('[') == -1 ? 1000 : Number(
                    name.slice(name.indexOf('[') + 1, name.indexOf(']'))
                );

                if (cpa < price) {
                    fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accID}`, {
                        "headers": {
                            "content-type": "application/x-www-form-urlencoded",
                            "x-csrftoken": `${csrfToken}`
                        },
                        "body": `ad_list=%5B%22${id}%22%5D&operation=enable`,
                        "method": "POST",
                    }).then(res => res.json()).then(res => {
                        console.log(`Enable adset: ${res.msg}`)
                    });
                }
            });
        });

        console.timeEnd(`${accID}: возврат`);
    }


    drawWindow1();
// autorulesStart();

    var csrfToken = document.cookie.slice(document.cookie.indexOf('csrftoken=')).split(';')[0].split('=')[1];
    var accountID = document.URL.slice(document.URL.indexOf('aadvid=') + 7);
    const ttt_autorules_enable_el = document.querySelector('.ttt_autorules_enable');
    const ttt_autorules_disable_el = document.querySelector('.ttt_autorules_disable');
    const ttt_templates = document.querySelector('#ttt_templates');
    const ttt_template_name = document.querySelector('#ttt_template_name');

// if (!window.localStorage.getItem('ttt_templates')) {
//     window.localStorage.setItem('ttt_templates', JSON.stringify({}))
// }

    Templator.reloadSelect()
    getPixel()

    const ttt_plugin_modal = document.querySelector('#ttt_plugin_modal');
    const ttt_plugin_openButton = document.querySelector('#ttt_plugin_openButton');
    const ttt_plugin_closeModal = document.querySelector('#ttt_plugin_closeModal');

    ttt_plugin_openButton.addEventListener('click', e => {
        console.log("OPENED")
        ttt_plugin_modal.classList.toggle('w3-show')
        ttt_plugin_modal.classList.toggle('w3-hide')
    })

    ttt_plugin_closeModal.addEventListener('click', e => {
        ttt_plugin_modal.classList.toggle('w3-show')
        ttt_plugin_modal.classList.toggle('w3-hide')
    })
    function openTab(ttt_open_tab, tabId) {
        const x = document.querySelectorAll(".ttt-tab-body");
        x.forEach(el => {
            el.style.display = "none";
        });

        const tablinks = document.querySelectorAll(".tablink");
        tablinks.forEach(el => {
            el.classList.remove("w3-border-red");
        });

        document.getElementById(tabId).style.display = "block";
        ttt_open_tab.firstElementChild.classList.add("w3-border-red");
    }

    async function removeCampaigns() {
        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/campaign/list/?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "lifetime": 1,
                "st": "",
                "et": "",
                "keyword": "",
                "search_type": 1,
                "campaign_status": ["no_delete"],
                "version": 1,
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "query_list": []
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            if (res.code == 0) {
                res.data.table.forEach(item => {
                    fetch(`https://ads.tiktok.com/api/v2/i18n/overture/campaign/update_status/?aadvid=${accountID}`, {
                        "headers": {
                            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                            "x-csrftoken": `${csrfToken}`
                        },
                        "body": `campaign_list=%5B%22${item.campaign_id}%22%5D&operation=delete`,
                        "method": "POST",
                    })
                })
            }
        });

        alert('Готово')
    }

    async function removeCreos(checkAssigned = false) {
        let d = new Date();
        let from = d.setMonth(d.getMonth() - 1);
        let fromD = new Date(from);
        let fromDString = fromD.toLocaleDateString('en-CA')
        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/material/list/?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "m_type": 3,
                "metrics": [],
                "base_infos": ['creative_nums'],
                "is_lifetime": 0,
                "order_field": "create_time",
                "order_type": 1,
                "page": 1,
                "page_size": 50,
                "keyword": "",
                "keyword_type": 4,
                "country": [],
                "image_mode": [],
                "placement_id": [],
                "source": [],
                "st": fromDString,
                "cost_lower": "0",
                "cost_upper": "0",
                "conversion_lower": "0",
                "conversion_upper": "0"
            }),
            "method": "POST"
        }).then(res => res.json()).then(res => {
            pages = Math.ceil(res.data.total / res.data.page_size);
            const materials = []
            res.data.material_infos.forEach(item => {
                if (checkAssigned) {
                    if (item.base_info.creative_nums == 0) {
                        materials.push(item.base_info.material_id)
                    }
                } else {
                    materials.push(item.base_info.material_id)
                }
            })
            fetch(`https://ads.tiktok.com/api/v3/i18n/material/video/delete/?aadvid=${accountID}`, {
                "headers": {
                    "content-type": "application/json",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    ids: materials
                }),
                "method": "POST",
            });
        });

        for (let i = 2; i < pages; i++) {
            await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/material/list/?aadvid=${accountID}`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "m_type": 3,
                    "metrics": [],
                    "base_infos": ['creative_nums'],
                    "is_lifetime": 0,
                    "order_field": "create_time",
                    "order_type": 1,
                    "page": i,
                    "page_size": 50,
                    "keyword": "",
                    "keyword_type": 4,
                    "country": [],
                    "image_mode": [],
                    "placement_id": [],
                    "source": [],
                    "st": fromDString,
                    "cost_lower": "0",
                    "cost_upper": "0",
                    "conversion_lower": "0",
                    "conversion_upper": "0"
                }),
                "method": "POST"
            }).then(res => res.json()).then(res => {
                pages = Math.ceil(res.data.total / res.data.page_size);
                const materials = []
                res.data.material_infos.forEach(item => {
                    if (checkAssigned) {
                        if (item.base_info.creative_nums == 0) {
                            materials.push(item.base_info.material_id)
                        }
                    } else {
                        materials.push(item.base_info.material_id)
                    }
                })
                fetch(`https://ads.tiktok.com/api/v3/i18n/material/video/delete/?aadvid=${accountID}`, {
                    "headers": {
                        "content-type": "application/json",
                        "x-csrftoken": `${csrfToken}`
                    },
                    "body": JSON.stringify({
                        ids: materials
                    }),
                    "method": "POST",
                });
            });
        }

        alert('Готово')
    }
    async function openPixel() {
        window.location.href =`https://ads.tiktok.com/i18n/events_manager/pixel?aadvid=${accountID}`
    }

    async function createPixel() {
        let accountID = document.URL.slice(document.URL.indexOf('aadvid=') + 7);

        let pixName, pixId;

        await fetch(`https://ads.tiktok.com/i18n/events_manager/v2/api/pixel/create?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
            },
            "body": "{\"PixelName\":\"PIXEL\",\"GTMStatus\":false,\"EventSetupMode\":0}",
            "method": "POST",
        }).then(res => res.json()).then(res => {
            if (res.message == "OK") {
                pixName = res.data.PixelCode;
                pixId = res.data.PixelID;
                console.log(`pixName: ${pixName}, pixId: ${pixId}`);
            } else {
                console.log("Step 1 ERROR");
            }
        });


        // await fetch(`https://ads.tiktok.com/i18n/events_manager/v2/api/pixel/${pixName}/check_installation?aadvid=${accountID}`, {
        //     "headers": {
        //         "content-type": "application/json;charset=UTF-8",
        //     },
        //     "body": JSON.stringify({
        //         "PageURL": `https://tabatas.online/pixel63?pix=${pixName}`
        //     }),
        //     "method": "POST",
        // }).then(res => res.json()).then(res => {
        //     if (res.message == "OK") {
        //         console.log('Site check OK');
        //     } else {
        //         console.log('Site check ERROR');
        //     }
        // });



        await fetch(`https://ads.tiktok.com/i18n/events_manager/v2/api/pixel/${pixName}/update_event_trigger_setting?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
            },
            "body": JSON.stringify({
                "EventTriggerSetting": {
                    "CompletePayment": {
                        "WebEventType": "CompletePayment",
                        "Currency": "",
                        "Value": "",
                        "CountingMethod": 4,
                        "EventName": "",
                        "TriggerRules": [
                            {
                                "TriggerType": 1,
                                "Variable": 9,
                                "Operator": 1,
                                "PageURL": "",
                                "Value": "asdasdasd",
                                "Parameters": {
                                    "Contents": [
                                        {
                                            "ContentFrom": 1
                                        }
                                    ],
                                    "ValueIndex": -1
                                }
                            }
                        ]
                    }
                }
            }),
            "method": "POST",
        });

        if (pixId) {
            alert(`Пиксель ${pixName} создан!`)
        } else {
            alert("Что-то пошло не так")
        }
    }

    function campaignsSetStatus(status) {
        fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/campaign/list/?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "lifetime": 1,
                "st": "",
                "et": "",
                "keyword": "",
                "search_type": 1,
                "campaign_status": ["no_delete"],
                "version": 1,
                "sort_stat": "stat_cost",
                "sort_order": 1,
                "page": 1,
                "limit": 50,
                "query_list": []
            }),
            "method": "POST",
        }).then(res => res.json())
            .then(res => {
                res.data.table.forEach(item => {
                    fetch(`https://ads.tiktok.com/api/v2/i18n/overture/campaign/update_status/?aadvid=${accountID}`, {
                        "headers": {
                            "content-type": "application/x-www-form-urlencoded",
                            "x-csrftoken": `${csrfToken}`
                        },
                        "body": `campaign_list=%5B%22${item.campaign_id}%22%5D&operation=${status}`,
                        "method": "POST",
                    }).then(res => res.json())
                        .then(data => {
                            if (data.msg == "success") {
                                console.log(`[SUCCESS CAMPAIGN ON]`);
                            } else {
                                console.log(`[ERROR CAMPAIGN ON]`);
                            }
                        });
                })
            });

        alert('Готово');
    }

    async function removeBlockedAds() {
        let pages;
        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "lifetime": 1,
                "st": "",
                "et": "",
                "search_type": 1,
                "ad_status": ["not_delivery"],
                "having_filter": [],
                "version": 1,
                "sort_stat": "time_attr_convert_cnt",
                "sort_order": 1,
                "campaign_ids": [],
                "page": 1,
                "limit": 50,
                "query_list": ["stat_cost",
                    "cpc",
                    "cpm",
                    "show_cnt",
                    "click_cnt",
                    "ctr",
                    "time_attr_convert_cnt",
                    "skan_convert_cnt",
                    "time_attr_conversion_cost",
                    "skan_conversion_cost",
                    "time_attr_conversion_rate",
                    "skan_conversion_rate",
                    "time_attr_effect_cnt",
                    "time_attr_effect_cost",
                    "time_attr_effect_rate"]
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            pages = res.data.pagination.page_count;
            res.data.table.forEach(item => {
                if (item.stat_data.show_cnt === 0) {
                    fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accountID}`, {
                        "headers": {
                            "content-type": "application/x-www-form-urlencoded",
                            "x-csrftoken": `${csrfToken}`
                        },
                        "body": "ad_list=%5B%22" + item.ad_id + "%22%5D&operation=delete",
                        "method": "POST",
                    }).then(res => res.json()).then(res => {
                        console.log(`Delete adset: ${res.msg}`)
                    });
                }
            })
        });

        for (let i = 2; i <= pages; i++) {
            fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accountID}`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "lifetime": 1,
                    "st": "",
                    "et": "",
                    "search_type": 1,
                    "ad_status": ["not_delivery"],
                    "having_filter": [],
                    "version": 1,
                    "sort_stat": "time_attr_convert_cnt",
                    "sort_order": 1,
                    "campaign_ids": [],
                    "page": i,
                    "limit": 50,
                    "query_list": ["stat_cost",
                        "cpc",
                        "cpm",
                        "show_cnt",
                        "click_cnt",
                        "ctr",
                        "time_attr_convert_cnt",
                        "skan_convert_cnt",
                        "time_attr_conversion_cost",
                        "skan_conversion_cost",
                        "time_attr_conversion_rate",
                        "skan_conversion_rate",
                        "time_attr_effect_cnt",
                        "time_attr_effect_cost",
                        "time_attr_effect_rate"
                    ]
                }),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                res.data.table.forEach(item => {
                    if (item.stat_data.show_cnt === 0) {
                        fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accountID}`, {
                            "headers": {
                                "content-type": "application/x-www-form-urlencoded",
                                "x-csrftoken": `${csrfToken}`
                            },
                            "body": "ad_list=%5B%22" + item.ad_id + "%22%5D&operation=delete",
                            "method": "POST",
                        }).then(res => res.json()).then(res => {
                            console.log(`Delete adset: ${res.msg}`)
                        });
                    }
                })
            });
        }
        alert('Готово');
    }

    async function adsOn() {
        let pages;
        let allOnAdsets = [];

        await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accountID}`, {
            "headers": {
                "content-type": "application/json;charset=UTF-8",
                "x-csrftoken": `${csrfToken}`
            },
            "body": JSON.stringify({
                "lifetime": 1,
                "st": "",
                "et": "",
                "search_type": 1,
                "ad_status": ["disable"],
                "having_filter": [{
                    "filter_type": 8,
                    "field": "time_attr_convert_cnt",
                    "upper": "",
                    "lower": "1"
                }],
                "version": 1,
                "sort_stat": "time_attr_convert_cnt",
                "sort_order": 1,
                "campaign_ids": [],
                "page": 1,
                "limit": 50,
                "query_list": [
                    "time_attr_effect_cnt"
                ]
            }),
            "method": "POST",
        }).then(res => res.json()).then(res => {
            pages = res.data.pagination.page_count;
        });

        for (let i = 0; i < pages; i++) {
            await fetch(`https://ads.tiktok.com/api/v3/i18n/statistics/ad/list/?aadvid=${accountID}`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "lifetime": 1,
                    "st": "",
                    "et": "",
                    "search_type": 1,
                    "ad_status": ["disable"],
                    "having_filter": [{
                        "filter_type": 8,
                        "field": "time_attr_convert_cnt",
                        "upper": "",
                        "lower": "1"
                    }],
                    "version": 1,
                    "sort_stat": "time_attr_convert_cnt",
                    "sort_order": 1,
                    "campaign_ids": [],
                    "page": i,
                    "limit": 50,
                    "query_list": [
                        "time_attr_effect_cnt"
                    ]
                }),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                res.data.table.forEach(item => {
                    allOnAdsets.push(item.ad_id)
                })
            });

        }

        console.log(allOnAdsets);

        allOnAdsets.forEach(item => {
            fetch(`https://ads.tiktok.com/api/v3/i18n/overture/ad/update_status/?aadvid=${accountID}`, {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": "ad_list=%5B%22" + item + "%22%5D&operation=enable",
                "method": "POST",
            }).then(res => res.json()).then(res => {
                console.log(`Enable adset: ${res.msg}`)
            });
        })

        alert('Готово');
    }

    ttt_templates.addEventListener('change', e => {
        const ttt_templates_in_storage = JSON.parse(window.localStorage.getItem('ttt_templates'));
        const templateName = e.target.value
        const correctTemplateObj = ttt_templates_in_storage[templateName]

        const blocked = ['ttt_bids', 'ttt_videos', 'ttt_titles']
        const arrayed = ['ttt_age']
        const arrayed_country = ['ttt_country']
        const radio = ['ttt_countInAdset', 'ttt_gender', 'tttt_stavka']

        for (const field in correctTemplateObj) {
            if (blocked.includes(field)) {
                let html = '';

                if (field == 'ttt_bids') {
                    html += '<h4>Биды</h4>'
                    correctTemplateObj[field].forEach(val => {
                        html += `
                    <div class="w3-row-padding w3-margin-top ttt_inputs_block">
                        <div class="w3-threequarter">
                            <label>Сумма бида</label>
                            <input class="w3-input w3-border-0" type="number" step="0.01" placeholder="3.00" value="${val.bid_summ}"
                                name="bid_summ">
                        </div>
                        <div class="w3-quarter ttt-mt-30">
                            <button
                                class="w3-button w3-circle w3-blue w3-tiny w3-padding-small ttt_add_inputsGroup">+</button>
                            <button
                                class="w3-button w3-circle w3-red w3-tiny w3-padding-small ttt_remove_inputsGroup">-</button>
                        </div>
                    </div>
                    `
                    });
                } else if (field == 'ttt_videos') {
                    html += '<h4>Видео</h4>'
                    correctTemplateObj[field].forEach(val => {
                        html += `
                    <div class="w3-row-padding w3-margin-top ttt_inputs_block">
                        <div class="w3-quarter">
                            <label>Название (!!!)</label>
                            <input class="w3-input w3-border-0" type="text" name="video_name" value="${val.video_name}"
                                placeholder="457T_Idealica_BE_!!!.mp4">
                        </div>
                        <div class="w3-quarter">
                            <label>Количество</label>
                            <input class="w3-input w3-border-0" type="number" value="${val.count}" placeholder="10"
                                name="count">
                        </div>
                        <div class="w3-quarter ttt-mt-30">
                            <button
                                class="w3-button w3-circle w3-blue w3-tiny w3-padding-small ttt_add_inputsGroup">+</button>
                            <button
                                class="w3-button w3-circle w3-red w3-tiny w3-padding-small ttt_remove_inputsGroup">-</button>
                        </div>
                    </div>
                    `
                    });
                } else if (field == 'ttt_titles') {
                    html += '<h4>Описания</h4>'
                    correctTemplateObj[field].forEach(val => {
                        html += `
                    <div class="w3-row-padding w3-margin-top ttt_inputs_block">
                        <div class="w3-threequarter">
                            <label>Описание</label>
                            <input class="w3-input w3-border-0" type="text" name="title" value="${val.title}"
                                placeholder="Es fácil ser delgado">
                        </div>
                        <div class="w3-quarter ttt-mt-30">
                            <button
                                class="w3-button w3-circle w3-blue w3-tiny w3-padding-small ttt_add_inputsGroup">+</button>
                            <button
                                class="w3-button w3-circle w3-red w3-tiny w3-padding-small ttt_remove_inputsGroup">-</button>
                        </div>
                    </div>
                    `
                    });
                }

                document.querySelector('.' + field).innerHTML = html
            } else if (arrayed.includes(field)) {
                document.querySelectorAll('[name=' + field + ']').forEach(item => {
                    let values = correctTemplateObj[field]
                    values = values.map(el => {
                        return el.join('-')
                    })
                    if (values.includes(item.value)) {
                        item.checked = true
                    } else {
                        item.checked = false
                    }
                })
            } else if (radio.includes(field)) {
                document.querySelectorAll('[name=' + field + ']').forEach(item => {
                    if (item.value == correctTemplateObj[field]) {
                        item.checked = true
                    } else {
                        item.checked = false
                    }
                })
            } else if (arrayed_country.includes(field)) {
                //console.log(document.querySelectorAll('[name=' + field + ']'))
                document.querySelectorAll('[name=' + field + ']')[0].forEach(item => {
                    let values = correctTemplateObj[field]
                    //console.log(item)
                    if (values.includes(item.value)) {
                        item.selected = true
                    } else {
                        item.selected = false
                    }
                })
            }else {
                document.querySelector('[name=' + field + ']').value = correctTemplateObj[field]
            }
        }
    })

    document.addEventListener('click', e => {
        const addInputs = e.target.closest('.ttt_add_inputsGroup')
        const removeInputs = e.target.closest('.ttt_remove_inputsGroup')
        const ttt_start_autozaliv = e.target.closest('.ttt_start_autozaliv')
        const ttt_activate_disabled = e.target.closest('.ttt_activate_disabled')
        const ttt_autorules_enable = e.target.closest('.ttt_autorules_enable')
        const ttt_autorules_disable = e.target.closest('.ttt_autorules_disable')
        const ttt_open_tab = e.target.closest('.ttt-open-tab')
        const ttt_templates_save = e.target.closest('.ttt_templates_save')
        const ttt_templates_delete = e.target.closest('.ttt_templates_delete')
        const ttt_campaigns_delete = e.target.closest('.ttt_campaigns_delete')
        const ttt_creos_delete = e.target.closest('.ttt_creos_delete')
        const ttt_open_pixel = e.target.closest('.ttt_open_pixel')
        const ttt_free_creos_delete = e.target.closest('.ttt_free_creos_delete')
        const ttt_create_pixel = e.target.closest('.ttt_create_pixel')
        const ttt_campaigns_on = e.target.closest('.ttt_campaigns_on')
        const ttt_ads_on = e.target.closest('.ttt_ads_on')
        const ttt_campaigns_off = e.target.closest('.ttt_campaigns_off')
        const ttt_ads_in_mod_delete = e.target.closest('.ttt_ads_in_mod_delete')
        const ttt_auth = e.target.closest('.ttt_auth')
        const ttt_checkZaliv = e.target.closest('.ttt_checkZaliv_button')


        if (addInputs) {
            e.preventDefault()
            const block = addInputs.parentElement.parentElement
            const container = block.parentElement;
            const cloned = block.cloneNode(true)
            container.appendChild(cloned)
        } else if (removeInputs) {
            e.preventDefault()
            const block = removeInputs.parentElement.parentElement
            const container = block.parentElement;
            if (container.querySelectorAll('.ttt_inputs_block').length > 1) {
                block.remove()
            }
        } else if (ttt_start_autozaliv) {
            e.preventDefault();
            let isValid = true;
            const ttt_autozaliv_form = document.querySelector('.ttt_autozaliv_form')
            const autozalivInputs = ttt_autozaliv_form.querySelectorAll('input')
            // autozalivInputs.forEach(input => {
            //     if (input.value === '') {
            //         input.classList.add('w3-border')
            //         input.classList.add('w3-border-red')
            //         isValid = false
            //     } else {
            //         input.classList.remove('w3-border')
            //         input.classList.remove('w3-border-red')
            //     }
            // });

            if (isValid) {
                ttt_start_autozaliv.setAttribute('disabled', 'disabled')
                avtozaliv();
                ttt_start_autozaliv.removeAttribute('disabled')
            }

        } else if (ttt_activate_disabled) {
            e.preventDefault();
            document.querySelectorAll('button.is-disabled').forEach(btn => {
                btn.classList.remove('is-disabled')
                btn.removeAttribute('disabled')
            })
        } else if (ttt_autorules_enable) {
            e.preventDefault()
            document.querySelector('#retSel').setAttribute('disabled', 'disabled')
            ttt_plugin_openButton.classList.remove('w3-blue')
            ttt_plugin_openButton.classList.add('w3-green')
            ttt_autorules_disable_el.removeAttribute('disabled')
            ttt_autorules_enable.setAttribute('disabled', 'disabled')
            startBtn()
        } else if (ttt_autorules_disable) {
            e.preventDefault()
            ttt_plugin_openButton.classList.add('w3-blue')
            ttt_plugin_openButton.classList.remove('w3-green')
            document.querySelector('#retSel').removeAttribute('disabled')
            ttt_autorules_enable_el.removeAttribute('disabled')
            ttt_autorules_disable.setAttribute('disabled', 'disabled')
            stopBtn()
        } else if (ttt_open_tab) {
            e.preventDefault()
            openTab(ttt_open_tab, ttt_open_tab.getAttribute('data-tabname'))
        } else if (ttt_templates_save) {
            const templateName = ttt_template_name.value
            if (templateName !== '') {
                if (!templateName || typeof templateName !== 'string') {
                    console.warn('[TTT] templateName is empty/invalid');
                    return;
                }

                // 1) прочитали існуючі шаблони (або створили порожній об’єкт)
                let ttt_templates_in_storage = safeParse(
                    window.localStorage.getItem('ttt_templates'),
                    {}
                );

                // Якщо раптом в storage лежить масив/примітив — перезаписуємо об’єктом
                if (Array.isArray(ttt_templates_in_storage) || ttt_templates_in_storage === null) {
                    ttt_templates_in_storage = {};
                }

                // 2) серіалізуємо форму
                const data = Templator.serialiseAutozaliv();
                ttt_templates_in_storage[templateName] = data;

                // 3) зберігаємо
                window.localStorage.setItem(
                    'ttt_templates',
                    safeStringify(ttt_templates_in_storage)
                );

                console.log('[TTT] saved template', templateName, ttt_templates_in_storage[templateName]);

                // 4) оновлюємо селект, якщо метод існує
                if (typeof Templator.reloadSelect === 'function') {
                    Templator.reloadSelect();
                }
            }
        } else if (ttt_templates_delete) {
            const templateName = ttt_templates.value
            if (templateName !== '') {
                const ttt_templates_in_storage = JSON.parse(window.localStorage.getItem('ttt_templates'));
                ttt_templates_in_storage[templateName] = null
                window.localStorage.setItem('ttt_templates', JSON.stringify(ttt_templates_in_storage))
                Templator.reloadSelect()
            }
        } else if (ttt_campaigns_delete) {
            let agree = confirm("Точно? Удалит все кампании с аккаунта")
            if (agree) {
                removeCampaigns();
            }
        } else if (ttt_creos_delete) {
            let agree = confirm("Точно? Удалит все крео с аккаунта")
            if (agree) {
                removeCreos();
            }
        }else if(ttt_open_pixel){
            openPixel()
        } else if (ttt_free_creos_delete) {
            removeCreos(true);
        } else if (ttt_create_pixel) {
            createPixel();
        } else if (ttt_campaigns_on) {
            campaignsSetStatus('enable')
        } else if (ttt_campaigns_off) {
            campaignsSetStatus('disable')
        } else if (ttt_ads_on) {
            adsOn()
        } else if (ttt_ads_in_mod_delete) {
            removeBlockedAds()
        } else if (ttt_auth) {
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=800,left=100,top=100`;
            open('https://ads.tiktok.com/marketing_api/auth?app_id=6945535911530594306&is_new_connect=0&is_new_user=0&redirect_uri=http%3A%2F%2Fapp.ttt3t.ru%2Fbusiness_center%2Fadd%2F&rid=x8bve6deknq', 'Привет)', params);
        } else if (ttt_checkZaliv) {
            e.preventDefault();
            let isValid = true;
            const ttt_autozaliv_form = document.querySelector('.ttt_checkZaliv')
            const autozalivInputs = ttt_autozaliv_form.querySelectorAll('input')
            // autozalivInputs.forEach(input => {
            //     if (input.value === '') {
            //         input.classList.add('w3-border')
            //         input.classList.add('w3-border-red')
            //         isValid = false
            //     } else {
            //         input.classList.remove('w3-border')
            //         input.classList.remove('w3-border-red')
            //     }
            // });

            if (isValid) {
                checkZaliv();
            }
        }

    })
    function safeParse(json, fallback) {
        try {
            const v = JSON.parse(json);
            return (v && typeof v === 'object') ? v : fallback;
        } catch { return fallback; }
    }
    function safeStringify(obj) {
        try { return JSON.stringify(obj); } catch { return '{}'; }
    }



//5
    async function checkZaliv() {

        let country = [Number(getValue('ttt_checkZaliv_country').replace('L', ''))];

        let offerMainLink = getValue('ttt_checkZaliv_link');














        let isoCountry = {
            "3865483"	:	"AG",
            "2782113"	:	"AU",
            "290291"	:	"BH",
            "1831722"	:	"CB",
            "3895114"	:	"CL",
            "3686110"	:	"CO",
            "3077311"	:	"CZ",
            "357994"	:	"EG",
            "3017382"	:	"FR",
            "2921044"	:	"GE",
            "390903"	:	"GR",
            "719819"	:	"HU",
            "1643084"	:	"IN",
            "3175395"	:	"IT",
            "248816"	:	"JO",
            "1522867"	:	"KZ",
            "285570"	:	"KW",
            "1733045"	:	"ML",
            "3996063"	:	"MX",
            "2542007"	:	"MA",
            "286963"	:	"OM",
            "3932488"	:	"PE",
            "1694008"	:	"PH",
            "798544"	:	"PO",
            "2264397"	:	"PT",
            "289688"	:	"QA",
            "798549"	:	"RO",
            "102358"	:	"SA",
            "1880251"	:	"SI",
            "2510769"	:	"SP",
            "1668284"	:	"TW",
            "1605651"	:	"TH",
            "298795"	:	"TR",
            "290557"	:	"AE",
            "1562822"	:	"VN",
        }

        let accountsID = [
            // "7087887638572580866",
        ];

        let optType = 96;


        let offerName = `${isoCountry[country[0]]}-4k-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}`;




        let countInAdset = 1;   // 2 - 1

        let age = [["25","34"],["35","44"],["45","54"],["55","100"]];

        let budget = "1000.00";

        let iconURL = "";
        let iconName = '1'; //'BL'

        let titles = [
            {
                "title": "1"
            },

        ]



        let BIP = '[0.10]';
        let bids = [
            [0.10],
            // [0.20],
            // [0.30],
        ]



        let videos = ['4k'];

        let vid1 = [
            [
                {
                    "video_info": {
                        "material_name": "3002.mp4",
                        "material_id": "7092764085902082050",
                        "video_id": "v10033g50000c9n8uqjc77u79q8uj33g"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/f0c2d5dd6a384e2e8bab8176dccffd7e"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "3001.mp4",
                        "material_id": "7092764052494499842",
                        "video_id": "v10033g50000c9n8up3c77ufrgsn1bf0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/cd865c3c50554f95b0c0d46f0a779a91"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "3004.mp4",
                        "material_id": "7092763999641976834",
                        "video_id": "v10033g50000c9n8ukrc77ucda7cl260"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/c66b570f080c46378067bce0e5a5bb62"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "3003.mp4",
                        "material_id": "7092764002275819521",
                        "video_id": "v10033g50000c9n8ukrc77u28vcn1q60"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/ca2f66cb6fa0430f9268b2e826196008"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "3005.mp4",
                        "material_id": "7092764009594126338",
                        "video_id": "v10033g50000c9n8ukrc77u92psh103g"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/1b156bb60be74b8393584c9dfb7e4d44"
                        }
                    ],
                    "image_mode": 15
                }
            ],[
                {
                    "video_info": {
                        "material_name": "4001.mp4",
                        "material_id": "7092768709732155393",
                        "video_id": "v10033g50000c9n9773c77uds8omogf0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/c8252832e9594e3e878afe9f2de2e11c"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "4002.mp4",
                        "material_id": "7092768698960920577",
                        "video_id": "v10033g50000c9n9773c77udqe4953g0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/531bfe5225fd41efa46b0b761bc03ee4"
                        }
                    ],
                    "image_mode": 15
                }
            ],

            [
                {
                    "video_info": {
                        "material_name": "4003.mp4",
                        "material_id": "7092768728223531010",
                        "video_id": "v10033g50000c9n9773c77u9aaoi1sgg"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/0de0c9749ca442dfabbe52eaf56348a8"
                        }
                    ],
                    "image_mode": 15
                }
            ],

            [
                {
                    "video_info": {
                        "material_name": "4004.mp4",
                        "material_id": "7092768710155681794",
                        "video_id": "v10033g50000c9n9773c77u67ubi31b0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/281096c726cd43798fcd4dee12988b00"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "4005.mp4",
                        "material_id": "7092768710155567106",
                        "video_id": "v10033g50000c9n9773c77u58maq20c0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/2522c7bca162422191989b6feb0276a3"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "5005.mp4",
                        "material_id": "7092768728223760386",
                        "video_id": "v10033g50000c9n9773c77uaskeca4eg"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/5304c0a147e2409fb3bbd67f11308b53"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "5002.mp4",
                        "material_id": "7092768710155649026",
                        "video_id": "v10033g50000c9n9773c77u48hc5t9g0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/1bde01a792b14e419b8545b3069f661f"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "5004.mp4",
                        "material_id": "7092768739921444866",
                        "video_id": "v10033g50000c9n9773c77ucb34rtgf0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/b5f8ca4ea54b4aaeb1aed1d876149100"
                        }
                    ],
                    "image_mode": 15
                }
            ],
            [
                {
                    "video_info": {
                        "material_name": "5003.mp4",
                        "material_id": "7092768712361345025",
                        "video_id": "v10033g50000c9n9773c77u8bgo9mhug"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/63dfa98b77ba47539a32dcae1694a711"
                        }
                    ],
                    "image_mode": 15
                }
            ],

            [
                {
                    "video_info": {
                        "material_name": "5001.mp4",
                        "material_id": "7092768709731860481",
                        "video_id": "v10033g50000c9n9773c77ucn99jhdg0"
                    },
                    "image_info": [
                        {
                            "web_uri": "v0201/d4f8058fb68948b884e02bd3f90809d8"
                        }
                    ],
                    "image_mode": 15
                }
            ],
        ];

        for (let i = 0; i < 1; i++) {
            const rand = Math.floor(Math.random() * 15);
            // if(i == 0)
            videos.push(vid1[rand]);
            // else if(i == 1)
            //     videos.push(vid2[rand]);
            // else if(i == 2)
            //     videos.push(vid3[rand]);
        }


        // НИЖЕ НИЧОГО НЕ МЕНЯТЬ
        // let accountID = document.URL.slice(document.URL.indexOf('aadvid=') + 7);
        let csrfToken = document.cookie.slice(document.cookie.indexOf('csrftoken=')).split(';')[0].split('=')[1];

        if(accountsID.length == 0) {
            accountsID = [
                document.URL.slice(document.URL.indexOf('aadvid=') + 7)
            ];
        }

        for(let i = 0; i < accountsID.length; i++) {
            avtozaliv(accountsID[i]);
        }

        async function avtozaliv(accountID) {
            let todayDate = `${new Date().getDate() < 10 ? '0' + (new Date().getDate()) : (new Date().getDate())}${new Date().getMonth() < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)}`;

            let cabName = await fetch(`https://ads.tiktok.com/api/v3/i18n/account/permission/detail/?aadvid=${accountID}`)
                .then(res => res.json())
                .then(res => res.data.account.name.replaceAll('_', ''));

            let optTypeSymb = 'CP';
            if (optType == 96) {
                optTypeSymb = 'CP';
            } else if (optType == 147) {
                optTypeSymb = 'ATC';
            } else if (optType == 148) {
                optTypeSymb = 'PAO';
            }

            let pixName, pixelId;
            await fetch(`https://ads.tiktok.com/api/v2/i18n/pixel/list/?aadvid=${accountID}&req_src=ad_creation&promotion_website_type=0&objective_type=3`)
                .then(res => res.json())
                .then(res => {
                    if (res.data.pixel_list) {
                        pixName = res.data.pixel_list[0].pixel_code;
                        pixelId = res.data.pixel_list[0].pixel_id;
                    } else {
                        console.log(cabName, ': Не создан пиксель');
                    }
                });
            console.log('Pixel ID: ', pixelId);

            let pixelToken = '1';
            await fetch(`https://ads.tiktok.com/i18n/events_manager/api/graphql?aadvid=${accountID}`, {
                "headers": {
                    "content-type": "application/json",
                },
                "body": "{\"operationName\":\"getPixelSettingDeveloperToken\",\"variables\":{\"where\":{\"pixelCode\":\""+pixName+"\",\"appID\":\"\"}},\"query\":\"query getPixelSettingDeveloperToken($where: SettingTokenInput) {\\n  getPixelSettingDeveloperToken(where: $where) {\\n    token\\n    status\\n    errMessage\\n    __typename\\n  }\\n}\\n\"}",
                "method": "POST",
            })
                .then(res => res.json())
                .then(res => {
                    if (res.data.getPixelSettingDeveloperToken.token) {
                        pixelToken = res.data.getPixelSettingDeveloperToken.token;
                    } else {
                        console.log(cabName, ': Ошибка токена пикселя');
                    }
                });
            console.log('Token pix:', pixelToken);


            let iconId;
            await fetch(`https://ads.tiktok.com/api/v3/i18n/identity/save/?aadvid=${accountID}&req_src=ad_creation`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify({
                    "display_name": iconName,
                    "profile_image": iconURL,
                    "identity_type": 1
                }),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                if(res.data.identity_info.identity_id)
                    iconId = res.data.identity_info.identity_id;
                else
                    console.log(cabName, ': Ошибка в создании иконки');
            });


            if (pixelId && iconId) {
                let videoPrefix = videos[0];

                for (let j = 0; j < bids.length; j++) {
                    let arrBid = bids[j];
                    let bidString = arrBid[0].toString().replace(/[^+\d]/g, '');

                    await sleep(8000);

                    let campaignName = `${offerName}_${bidString}`;

                    let campaignId = await createCampaign(campaignName, accountID);
                    console.log('Campaign ID: ', campaignId);

                    if (campaignId) {
                        for (let i = 1; i < videos.length; i += countInAdset) {

                            let adsetOption = {
                                'i': i,
                                'adsetName': `${offerName}_${videoPrefix}_${optTypeSymb}_!!! ${BIP}`,
                                'campaignId': campaignId,
                                'bid': arrBid[0],
                                'url': `${offerMainLink}`,//?subid1=${cabName}${bidString}${videoPrefix}${offerName},
                                'pixelId': pixelId,
                                'iconId': iconId,
                            }

                            createAdset(adsetOption, accountID);
                        }


                    }
                }


            }
            alert('Все готово!');
        }

        async function createCampaign(_campaignName, accountID) {
            let campignid;

            let newCampaignDataJSON = {
                "struct_version": 1,
                "coming_source_type": 1,
                "app_id": "",
                "campaign_name": _campaignName,
                "ecomm_type": 0,
                "roas_bid": 0,
                "objective_type": 3,
                // === ДОДАЙТЕ АБО ОНОВІТЬ ЦІ КЛЮЧОВІ ПОЛЯ SMART+ ===
                "redesign_campaign_type": 1,
                "spc_automation_type": 1, // Вказує на Smart+
                "spc_upgrade_mode": 0,
                "spc_multi_ad_mode": 0,
                "sales_destination": 3,
                "universal_type": 1,
                "coming_source_type": 1,

                // Тимчасові ID, які потрібні API для контексту
                "campaign_snap_id": "1843100412825650",
                "campaign_draft_id": "1843100412826626",
                "rf_campaign_type": 0,
                "industry_types": [],
                "universal_type": 0,
                "campaign_app_profile_page_type": 0,
                "budget_mode": -1,
                "buying_type": 1,
                "dedicate_type": 1,
                "ab_test": 0,
                "app_campaign_type": 0,
                "onelink_url": "",
                "redesign_campaign_type": 1,
                "onelink_type": 0,
                "plan_version_type": 0,
                "budget_optimize_switch": 0,
                "ad_channel": 1,
                "budget": ""
            }

            await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/campaign/create/?aadvid=${accID}&req_src=ad_creation`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify(newCampaignDataJSON),
                "method": "POST",
            }).then(res => res.json()).then(res => {
                campignid = res.data.campaign_id
            });

            return campignid;
        }

        async function createAdset(adsetOptions, accountID) {
            console.log("createAdset")

            let nowDate = new Date();
            nowDate.setSeconds(600);
            timezone= await getzone();
            let startdate = `${nowDate.toLocaleDateString('en-CA',{timeZone:timezone})} ${nowDate.toLocaleTimeString('it-IT',{timeZone:timezone})}`;

            let _imgList = [];
            for (let i = 0; i < countInAdset; i++) {
                if (videos[adsetOptions.i + i])
                    _imgList.push(videos[adsetOptions.i + i][0])
            }

            let currentVideoName = _imgList[0].video_info.material_name;
            currentVideoName = currentVideoName.replaceAll('.mp4', '').replaceAll('_', '');

            let _adsetName = adsetOptions.adsetName.replace('!!!', currentVideoName);

            if (_imgList.length == 0) {
                return console.log('Ошибка в создании адсета: ', _adsetName, '. Что-то не так с видео.')
            }
            var adsetJson
            if(stavka === 1){
                console.log("Авто-ставка");
                adsetJson = {
                    "base_info": {
                        "name": _adsetName,
                        "struct_version": 1,
                        "app_name": "",
                        "target_device_version": 0,
                        "ad_app_profile_page_type": 0,
                        "shop_id": 0,
                        "shop_authorized_bc": 0,
                        "flow_package_include": [],
                        "action_days_v2": [],
                        "roas_bid": 0,
                        "targeting_expansion": {
                            "expansion_enabled": false,
                            "expansion_types": []
                        },
                        "include_custom_actions": [],
                        "source": "",
                        "is_hfss": 0,
                        "video_actions": [],
                        "auto_open": 0,
                        "ad_ref_pixel_id": pixelId, ///
                        "video_actions_v2": [],
                        "start_time": startdate,
                        "ad_reach_frequency_buy_type": 0,
                        "identity_bc_id": 0,
                        "statistic_type": 0,
                        "ad_tag_v2": [],
                        "inventory_flow": [
                            3000
                        ],
                        "external_action": 96,
                        "retargeting_tags": [],
                        "cpa_auto": 0,
                        "rf_predict_reach": 0,
                        "action_scene": [
                            2
                        ],
                        "creative_display_mode": 0,
                        "gender": gender,
                        "first_frame": [],
                        "ad_keywords": [],
                        "operators_id": [],
                        "ad_download_status": 0,
                        "budget_mode": 0,
                        "open_url": "",
                        "campaign_id": adsetOptions.campaignId,
                        "exclude_custom_actions": [],
                        "num": 1,
                        "pricing": 9,
                        "device_type": 0,
                        "cover_frequency_type": 1,//0,
                        "catalog_authorized_bc": 0,
                        "android_osv": "",
                        "language_list": [],
                        "flow_precision": 0,
                        "frequency_schedule": 7,//0,
                        "ab_test_id": 0,
                        "retargeting_audience_rule": {
                            "inclusions": null,
                            "exclusions": null
                        },
                        "interest_keywords_i18n": [],
                        "rf_estimate_key": "0",
                        "end_time": "2031-12-16 13:28:16",
                        "city": [],
                        "retargeting_tags_exclude": [],
                        "brand_safety": 1,
                        "shop_type": 0,
                        "action_track_url": [],
                        "daily_retention_ratio": 0,
                        "rf_predict_impression": 0,
                        "package": "",
                        "country": country,
                        "is_open_url": 0,
                        "fallback_type": 0,
                        "search_delivery_type": 0,
                        "compliance_signature": "",
                        "vast_moat": false,
                        "automated_targeting": 0,
                        "track_url": [],
                        "optimize_goal": 100,
                        "domain": "",
                        "op_sys_filter": 0,
                        "native_type": 1,
                        "deep_cpabid": 0,
                        "flow_control_mode": 1,//0,
                        "platform": [
                            0
                        ],
                        "particle_locations": country,
                        "inventory_type": [],
                        "download_url": "",
                        "rf_predict_percentage": 0,
                        "cpv_video_duration_type": 0,
                        "cpa_bid_type": 0,
                        "app_retargeting_install": false,
                        "smart_bid_type": 7,//0,
                        "external_type": 102,
                        "conversion_window": 0,
                        "cpa_skip_first_phrase": 1,
                        "ios14_quota_type": 1,
                        "deep_bid_type": 0,
                        "identity_id": "",
                        "content_type": 1,
                        "ios_osv": "",
                        "promotion_website_type": 0,
                        "is_share_disable": 0,
                        "is_comment_disable": 0,
                        "action_scenes_v2": [],
                        "exclude_app_package_id": 0,
                        "budget": budget,
                        "districts": [],
                        "frequency": 3,//0,
                        "week_schedule": [
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            []
                        ],
                        "product_platform_id": 0,
                        "mcc_mnc": [],
                        "age": age,
                        "external_url": "",
                        "ac": [],
                        "last_frame": [],
                        "dpa_open_url_type": 0,
                        "creative_material_mode": 3,
                        "cpa_bid": "",//adsetOptions.bid,
                        "app_type": 0,
                        "carriers": [],
                        "objective_type": 3,
                        "coming_source_type": 1,//6,
                        "avatar_icon": {
                            "hash": "",
                            "url": "",
                            "uri": "",
                            "height": 100,
                            "width": 100,
                            "web_uri": ""
                        },
                        "dpa_retargeting_type": 0,
                        "action_categories_v2": [],
                        "app_retargeting_type": 0,
                        "ad_category_detail": 0,
                        "bid": "",
                        "classify": 1,
                        "province": [],
                        "brand_safety_partner": 0,
                        "flow_package_exclude": [],
                        "interest_keywords_lang_i18n": [],
                        "device_models": [],
                        "ad_tag": [],
                        "effective_frame": [],
                        "product_set_id": 0,
                        "launch_price": [],
                        "identity_type": 0,
                        "deep_external_action": 0,
                        "params_type": 0,
                        "is_rf_premium_inventory": false,
                        "schedule_type": 1,
                        "dpa_local_audience": 0,
                        "ad_ref_app_id": "",
                        "inventory_flow_type": 1,
                        "is_drop": 0
                    }
                }
            }else if(stavka === 2){
                console.log("Фикс ставка");
                adsetJson = {
                    "base_info": {
                        "name": _adsetName,
                        "struct_version": 1,
                        "app_name": "",
                        "target_device_version": 0,
                        "ad_app_profile_page_type": 0,
                        "shop_id": 0,
                        "shop_authorized_bc": 0,
                        "flow_package_include": [],
                        "action_days_v2": [],
                        "roas_bid": 0,
                        "targeting_expansion": {
                            "expansion_enabled": false,
                            "expansion_types": []
                        },
                        "include_custom_actions": [],
                        "source": "",
                        "is_hfss": 0,
                        "video_actions": [],
                        "auto_open": 0,
                        "ad_ref_pixel_id": pixelId, ///
                        "video_actions_v2": [],
                        "start_time": startdate,
                        "ad_reach_frequency_buy_type": 0,
                        "identity_bc_id": 0,
                        "statistic_type": 0,
                        "ad_tag_v2": [],
                        "inventory_flow": [
                            3000
                        ],
                        "external_action": 96,
                        "retargeting_tags": [],
                        "cpa_auto": 0,
                        "rf_predict_reach": 0,
                        "action_scene": [
                            2
                        ],
                        "creative_display_mode": 0,
                        "gender": gender,
                        "first_frame": [],
                        "ad_keywords": [],
                        "operators_id": [],
                        "ad_download_status": 0,
                        "budget_mode": 0,
                        "open_url": "",
                        "campaign_id": adsetOptions.campaignId,
                        "exclude_custom_actions": [],
                        "num": 1,
                        "pricing": 9,
                        "device_type": 0,
                        "cover_frequency_type": 0,
                        "catalog_authorized_bc": 0,
                        "android_osv": "",
                        "language_list": [],
                        "flow_precision": 0,
                        "frequency_schedule": 0,
                        "ab_test_id": 0,
                        "retargeting_audience_rule": {
                            "inclusions": null,
                            "exclusions": null
                        },
                        "interest_keywords_i18n": [],
                        "rf_estimate_key": "0",
                        "end_time": "2031-12-16 13:28:16",
                        "city": [],
                        "retargeting_tags_exclude": [],
                        "brand_safety": 1,
                        "shop_type": 0,
                        "action_track_url": [],
                        "daily_retention_ratio": 0,
                        "rf_predict_impression": 0,
                        "package": "",
                        "country": country,
                        "is_open_url": 0,
                        "fallback_type": 0,
                        "search_delivery_type": 0,
                        "compliance_signature": "",
                        "vast_moat": false,
                        "automated_targeting": 0,
                        "track_url": [],
                        "optimize_goal": 100,
                        "domain": "",
                        "op_sys_filter": 0,
                        "native_type": 1,
                        "deep_cpabid": 0,
                        "flow_control_mode": 0,
                        "platform": [
                            0
                        ],
                        "particle_locations": country,
                        "inventory_type": [],
                        "download_url": "",
                        "rf_predict_percentage": 0,
                        "cpv_video_duration_type": 0,
                        "cpa_bid_type": 0,
                        "app_retargeting_install": false,
                        "smart_bid_type": 0,
                        "external_type": 102,
                        "conversion_window": 0,
                        "cpa_skip_first_phrase": 1,
                        "ios14_quota_type": 1,
                        "deep_bid_type": 0,
                        "identity_id": "",
                        "content_type": 1,
                        "ios_osv": "",
                        "promotion_website_type": 0,
                        "is_share_disable": 0,
                        "is_comment_disable": 0,
                        "action_scenes_v2": [],
                        "exclude_app_package_id": 0,
                        "budget": budget,
                        "districts": [],
                        "frequency": 0,
                        "week_schedule": [
                            [],
                            [],
                            [],
                            [],
                            [],
                            [],
                            []
                        ],
                        "product_platform_id": 0,
                        "mcc_mnc": [],
                        "age": age,
                        "external_url": "",
                        "ac": [],
                        "last_frame": [],
                        "dpa_open_url_type": 0,
                        "creative_material_mode": 3,
                        "cpa_bid": adsetOptions.bid,
                        "app_type": 0,
                        "carriers": [],
                        "objective_type": 3,
                        "coming_source_type": 6,
                        "avatar_icon": {
                            "hash": "",
                            "url": "",
                            "uri": "",
                            "height": 100,
                            "width": 100,
                            "web_uri": ""
                        },
                        "dpa_retargeting_type": 0,
                        "action_categories_v2": [],
                        "app_retargeting_type": 0,
                        "ad_category_detail": 0,
                        "bid": "",
                        "classify": 1,
                        "province": [],
                        "brand_safety_partner": 0,
                        "flow_package_exclude": [],
                        "interest_keywords_lang_i18n": [],
                        "device_models": [],
                        "ad_tag": [],
                        "effective_frame": [],
                        "product_set_id": 0,
                        "launch_price": [],
                        "identity_type": 0,
                        "deep_external_action": 0,
                        "params_type": 0,
                        "is_rf_premium_inventory": false,
                        "schedule_type": 1,
                        "dpa_local_audience": 0,
                        "ad_ref_app_id": "",
                        "inventory_flow_type": 1,
                        "is_drop": 0
                    }
                }
            }

            let adsetId;
            try {
                const createRes = await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/ad/create/?aadvid=${accID}&req_src=ad_creation`, {
                    headers: {
                        "content-type": "application/json;charset=UTF-8",
                        "x-csrftoken": `${csrfToken}`
                    },
                    body: JSON.stringify(adsetJson),
                    method: "POST",
                });

                const createJson = await createRes.json();
                if (createJson && createJson.msg == 'success') {
                    adsetId = createJson.data.ad_ids;
                } else {
                    console.log('Ошибка создание Адсета: ', createJson && createJson.msg);
                }
            } catch (e) {
                console.error('Ошибка при запросе создания адсета:', e);
            }

            if(!adsetId) return;

            //3         ad creo
            let external_url = adsetOptions.url.replace('!!!', currentVideoName);

            let lastidJson = {
                "ad_ids": adsetId,
                "inventory_flow": [
                    3000
                ],
                "inventory_flow_type": 1,
                "objective_type": 3,
                "creative_material_mode": 2,
                "playable_url": "",
                "coming_source_type": 1,
                "is_smart_creative": true,
                "creative_name": `${currentVideoName}`,
                "app_name": "",
                "source": iconName,
                "item_source": 0,
                "image_list": _imgList,
                "title_list": titles,
                "page_list": [],
                "card_list": [],
                "advanced_creative": [],
                "call_to_action_list": [{ call_to_action: "shop_now" }],
                "call_to_action_id": "",
                "avatar_icon": { url: "https://p21-ad-sg.ibyteimg.com/obj/" + iconURL, width: 336, web_uri: iconURL, height: 336 },
                identity_id: adsetOptions.iconId || iconId || '',
                identity_type: 1,
                open_url: "",
                is_open_url: 0,
                auto_open: 0,
                external_url: (adsetOptions.url || '').replace('!!!', currentVideoName),
                external_url_domain: "",
                fallback_type: 0,
                is_creative_authorized: false,
                is_presented_video: 0,
                agr_task_ids: [],
                track_url: [],
                action_track_url: [],
                vast_moat: 0,
                vast_double_verify: 0,
                vast_ias: false,
                vast_url: "",
                tracking_pixel_id: pixelId,
                tracking_app_id: "0",
                tracking_offline_event_set_ids: [],
                destination_url_type: "WEB_SITE",
                attachment_creative_preview_url: "",
                attachment_creative_type: 0,
                card_id: "",
                page_id: "",
                has_creative: false,
                ad_source_value: -1,
                ad_type_value: -1,
                brand_safety_vast_url: "",
                brand_safety_postbid_partner: 0,
                is_brandsafety_track_open: false,
                urls_precheck_result: { material_results: [], summary_results: [], success: false },
                struct_version: 1,
                ad_channel: 1
            }

            await fetch(`https://ads.tiktok.com/api/v3/i18n/perf/creative/create/?aadvid=${accountID}&req_src=ad_creation`, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                    "x-csrftoken": `${csrfToken}`
                },
                "body": JSON.stringify(lastidJson),
                "method": "POST",
            }).then(res => res.json())
                .then(res => { console.log("Adset create ", res.msg, ": ", _adsetName); });
        }
    }
    // expose functions so UI can call them directly and to reduce 'unused' analyzer warnings
    window.avtozaliv = avtozaliv;
    window.getPixel = getPixel;
    window.createAdset_plug = createAdset_plug;
    window.getVideos = getVideos;
    window.createCampaign_plug = createCampaign_plug;
    window.getzone = getzone;
    window.safeFetchJson = safeFetchJson;
}());
