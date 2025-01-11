package com.mtn.shortner.controller;

import com.mtn.publicConnector.bean.mtnCommonBean.bean.Url;
import com.mtn.publicConnector.bean.mtnCommonBean.entity.DataDemo;
import com.mtn.publicConnector.outbound.template.RadisCachingTemplate;
import com.mtn.publicConnector.outbound.template.UrlManagerInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class UrlController {

    @Autowired
    private UrlManagerInterface<Url> UrlManagerInterface;

    @Autowired
    private RadisCachingTemplate<DataDemo> radisCachingTemplate;

    @RequestMapping(value = "/{url}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> shortenUrl(@RequestParam String url) {
        Url shortUrlEntry = UrlManagerInterface.shortenUrl(url);
        return ResponseEntity.ok(shortUrlEntry.getKey());
    }

    @RequestMapping(value = "/{key}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> getUrl(@RequestParam String key) {
        String url = UrlManagerInterface.getUrlByKey(key);
        return ResponseEntity.ok(url);
    }

    @RequestMapping(value = "/caching",method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<DataDemo> createObject(@RequestBody DataDemo dataDemo) {
        return ResponseEntity.ok(radisCachingTemplate.saveData(dataDemo));
    }

    @RequestMapping(value = "/caching/{key}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<DataDemo> getObject(@RequestParam("Key") String key,@RequestParam("HashKey") String hashKey) {

        return ResponseEntity.ok(radisCachingTemplate.getData(key,hashKey));
    }

    @RequestMapping(value = "/caching/notDuplicate",method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Boolean> checkDuplicate(@RequestBody DataDemo dataDemo) {
        return ResponseEntity.ok(radisCachingTemplate.checkDuplicate(dataDemo));
    }


}