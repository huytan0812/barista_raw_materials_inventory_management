package com.bar_raw_materials.controllers.staff;

import com.bar_raw_materials.services.batch.BatchService;
import com.bar_raw_materials.dto.batch.BatchDTO;
import com.bar_raw_materials.dto.batch.LightBatchDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${apiStaff}/batch")
public class BatchController extends BaseStaffController {
    BatchService batchService;

    @Autowired
    public BatchController(BatchService batchService) {
        super(batchService);
        this.batchService = batchService;
    }

    @GetMapping("allLight")
    public List<LightBatchDTO> getAllLight() {
        return batchService.getAllLight();
    }

    @GetMapping("search")
    public ResponseEntity<Page<BatchDTO>> getSearchResult(
        @Nullable @RequestParam("search") String searchText,
        @Nullable @RequestParam("sort") String sort,
        @Nullable @RequestParam(defaultValue="0", name="page") Integer page,
        @Nullable @RequestParam(defaultValue="5", name="size") Integer size
    ) {
        Page<BatchDTO> responseData = null;
        boolean containSearch = searchText != null && !searchText.isEmpty();
        boolean containSort = sort != null && !sort.isEmpty();

        if (containSearch && containSort) {
            responseData = batchService.searchAndSort(searchText, sort, page, size);
        }
        else if (containSearch) {
            responseData = batchService.searchByProductName(searchText, page, size);
        }
        else {
            responseData = batchService.sortByQuantityRemain(sort, page, size);
        }
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("filter")
    public ResponseEntity<Page<BatchDTO>> getFilterResult(
            @RequestParam("filter") String filter,
            @Nullable @RequestParam(defaultValue="0", name="page") Integer page,
            @Nullable @RequestParam(defaultValue="10", name="size") Integer size
    ) {
        Page<BatchDTO> responseData = batchService.filterByExpDate(filter, page, size);
        return ResponseEntity.ok(responseData);
    }
}
