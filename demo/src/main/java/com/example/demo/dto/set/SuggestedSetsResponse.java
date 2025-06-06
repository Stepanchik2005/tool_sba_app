package com.example.demo.dto.set;

import com.example.demo.models.Set.Instrument;
import com.example.demo.models.Set.ToolAdapter;
import com.example.demo.models.Set.ToolHolder;

public record SuggestedSetsResponse(ToolHolderResponse toolHolder, InstrumentResponse instrument, ToolAdapterResponse toolAdapter) {

}
